// @ts-ignore
import * as browserslist from 'browserslist';
import {gte as gteVersion} from 'semver';
import * as ts from 'typescript';
import {Definitions} from './built-in-definitions';
import * as definitions from './built-in-definitions';
import semverify, {firstVersion} from './semverify';

interface EnvSupportInfo {
    // [env name]: version
    [key: string]: string;
}

interface BuiltInsList {
    // [name]:
    [key: string]: EnvSupportInfo;
}

export type PolyfillStatusOrModuleName = false | string;

export interface PolyfillsList {
    [key: string]: PolyfillStatusOrModuleName;
}

export interface PolyfillsGeneratorOptions {
    targets?: string;
    polyfills?: PolyfillsList;
}

const {hasOwnProperty} = Object.prototype;
const fetchBuiltInFeature: string = 'es6.fetch';
const promiseBuiltInFeature: string = 'es6.promise';
const allBuiltIns: BuiltInsList = require('../data/built-ins.json');
const allPolyfills: PolyfillsList = require('../data/polyfills.json');
const allVersionsKey: string = 'all';
const browserNameMap: {[key: string]: string} = {
    and_chr: 'chrome',
    and_ff: 'firefox',
    ios_saf: 'ios'
};
const isString = (value: any) => Object.prototype.toString.call(value) === '[object String]';

export function createPolyfillsTransformerFactory(
    options: PolyfillsGeneratorOptions = {}
): ts.TransformerFactory<ts.SourceFile> {
    // {[env name]: version}
    const targets: {[key: string]: string} = Object.create(null);
    const polyfillsConfig: PolyfillsList = options.polyfills as PolyfillsList;
    const unsupportedBuiltIns: {[key: string]: string} = Object.create(null);
    const polyfills: PolyfillsList = Object.create(null);

    browserslist(options.targets).forEach((browser: string) => {
        const [browserName, browserVersion] = browser.split(' ');
        const normalizedBrowserName: string = browserNameMap[browserName] || browserName;
        const splitVersion: string = browserVersion.split('-')[0].toLowerCase();

        targets[normalizedBrowserName] = splitVersion === allVersionsKey ? firstVersion : semverify(splitVersion);
    });

    for (const feature in polyfillsConfig) {
        if (hasOwnProperty.call(polyfillsConfig, feature)) {
            polyfills[feature] = polyfillsConfig[feature];
        }
    }

    for (const feature in allBuiltIns) {
        if (hasOwnProperty.call(allBuiltIns, feature)) {
            const featureStatusOrModuleName: PolyfillStatusOrModuleName = polyfills[feature];
            const polyfillModuleName: string =
                featureStatusOrModuleName === false
                    ? undefined
                    : isString(featureStatusOrModuleName)
                        ? (featureStatusOrModuleName as string)
                        : allPolyfills[feature];

            if (polyfillModuleName) {
                const supportInfo: EnvSupportInfo = allBuiltIns[feature];
                let isSupported: boolean = false;

                for (const env in targets) {
                    if (hasOwnProperty.call(targets, env)) {
                        const supportVersion: string = supportInfo[env];

                        if (supportVersion && gteVersion(targets[env], supportVersion)) {
                            isSupported = true;
                        } else {
                            isSupported = false;
                            break;
                        }
                    }
                }

                if (!isSupported) {
                    unsupportedBuiltIns[feature] = polyfillModuleName;
                }
            }
        }
    }

    return function polyfillsTransformerFactory(context: ts.TransformationContext): ts.Transformer<ts.SourceFile> {
        let newImportDeclarations: Record<string, ts.ImportDeclaration>;
        const addPolyfillImports = (features: string[]) => {
            features.forEach((feature: string) => {
                const polyfillModuleName: string = unsupportedBuiltIns[feature];

                if (polyfillModuleName) {
                    newImportDeclarations[polyfillModuleName] =
                        newImportDeclarations[polyfillModuleName] ||
                        ts.createImportDeclaration(
                            undefined,
                            undefined,
                            undefined,
                            ts.createStringLiteral(polyfillModuleName)
                        );
                }
            });
        };
        const visitor: ts.Visitor = (node) => {
            switch (node.kind) {
                case ts.SyntaxKind.VariableDeclaration: {
                    const {initializer, name} = node as ts.VariableDeclaration;
                    const builtInName = initializer.text;

                    if (builtInName === 'fetch') {
                        addPolyfillImports([fetchBuiltInFeature]);
                    } else {
                        const {elements} = name as ts.ObjectBindingPattern;
                        const staticMethodsDefinitions: Definitions = definitions.staticMethods[builtInName];

                        if (elements && staticMethodsDefinitions) {
                            const features: string[] = elements.reduce((result: string[], {name}) => {
                                const staticFeatures: string[] = staticMethodsDefinitions[name.text];

                                if (staticFeatures) {
                                    return result.concat(staticFeatures);
                                }

                                return result;
                            }, []);

                            if (features[0]) {
                                addPolyfillImports(features);
                            }
                        }
                    }

                    break;
                }
                case ts.SyntaxKind.CallExpression:
                case ts.SyntaxKind.NewExpression: {
                    const expression: ts.Identifier = node.expression;
                    const features: string[] = definitions.builtIns[expression.text];

                    // Symbol()
                    // fetch(..)
                    // new Map()
                    if (features) {
                        addPolyfillImports(features);
                    }

                    break;
                }
                case ts.SyntaxKind.PropertyAccessExpression: {
                    const {expression, name} = node as ts.PropertyAccessExpression;
                    const builtInName = expression.text;
                    const methodName: string = name.text;
                    const instanceFeatures: string[] = definitions.instanceMethods[methodName];

                    // 'test'.padStart()
                    // fn.bind(...)
                    if (instanceFeatures) {
                        addPolyfillImports(instanceFeatures);
                    }

                    if (builtInName === 'Promise') {
                        addPolyfillImports([promiseBuiltInFeature]);
                    }

                    const staticMethodsDefinitions: Definitions = definitions.staticMethods[builtInName];
                    const staticFeatures: string[] = staticMethodsDefinitions && staticMethodsDefinitions[methodName];

                    // Array.from(...)
                    // Object.assign(...)
                    if (staticFeatures) {
                        addPolyfillImports(staticFeatures);
                    }

                    break;
                }
                default:
                //
            }

            return ts.visitEachChild(node, visitor, context);
        };

        return function polyfillsTransformer(sourceFile: ts.SourceFile): ts.SourceFile {
            newImportDeclarations = {};
            const updatedSourceFile = ts.visitNode(sourceFile, visitor);
            const imports: string[] = Object.keys(newImportDeclarations);

            if (imports[0]) {
                return ts.updateSourceFileNode(updatedSourceFile, [
                    ...imports.sort().map((name: string) => newImportDeclarations[name]),
                    ...updatedSourceFile.statements
                ] as ReadonlyArray<ts.Statement>) as ts.SourceFile;
            }

            return updatedSourceFile;
        };
    };
}
