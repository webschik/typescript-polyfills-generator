// @ts-ignore
import * as browserslist from 'browserslist';
import * as ts from 'typescript';
import semverify, {firstVersion} from './semverify';

interface BrowsersSupportList {
    // [browser name]: version
    [key: string]: string;
}

interface BuiltInsList {
    // [name]:
    [key: string]: BrowsersSupportList;
}

export type PolyfillStatusOrModuleName = boolean | string;

export interface PolyfillsList {
    [key: string]: PolyfillStatusOrModuleName;
}

export interface PolyfillsGeneratorOptions {
    targets?: string;
    polyfills?: PolyfillsList;
}

const {hasOwnProperty} = Object.prototype;
const allBuiltInsWithEsVersion: BuiltInsList = require('../data/built-ins.json');
const allPolyfills: PolyfillsList = require('../data/polyfills.json');
const allVersionsKey: string = 'all';
const allBuiltIns: BuiltInsList = Object.create(null);
const browserNameMap: {[key: string]: string} = {
    and_chr: 'chrome',
    and_ff: 'firefox',
    ios_saf: 'ios'
};

for (const builtIn in allBuiltInsWithEsVersion) {
    if (hasOwnProperty.call(allBuiltInsWithEsVersion, builtIn)) {
        const browsersList: BrowsersSupportList = allBuiltInsWithEsVersion[builtIn];
        const normalizedBrowsersList: BrowsersSupportList = Object.create(null);

        for (const browserName in browsersList) {
            if (hasOwnProperty.call(browsersList, browserName)) {
                const browserVersion: string = browsersList[browserName];

                normalizedBrowsersList[browserName] = semverify(browserVersion);
            }
        }

        allBuiltIns[builtIn] = normalizedBrowsersList;
    }
}

export function createPolyfillsTransformerFactory(
    program: ts.Program,
    options: PolyfillsGeneratorOptions = {}
): ts.TransformerFactory<ts.SourceFile> {
    const targets: {[key: string]: any} = Object.create(null);
    const polyfillsConfig: PolyfillsList = options.polyfills as PolyfillsList;
    const polyfills: PolyfillsList = Object.create(null);

    for (const builtIn in polyfillsConfig) {
        if (hasOwnProperty.call(polyfillsConfig, builtIn)) {
            polyfills[builtIn] = polyfillsConfig[builtIn];
        }
    }

    browserslist(options.targets).forEach((browser: string) => {
        const [browserName, browserVersion] = browser.split(' ');
        const normalizedBrowserName: string = browserNameMap[browserName] || browserName;
        const splitVersion: string = browserVersion.split('-')[0].toLowerCase();

        targets[normalizedBrowserName] = splitVersion === allVersionsKey ? firstVersion : semverify(splitVersion);
    });

    return function polyfillsTransformerFactory(context: ts.TransformationContext): ts.Transformer<ts.SourceFile> {
        function visitor(node: ts.Node): ts.Node {
            switch (node.kind) {
                case ts.SyntaxKind.PropertyAccessExpression: {
                    const {name, expression} = node as ts.PropertyAccessExpression;

                    break;
                }
                default:
                //
            }

            return ts.visitEachChild(node, visitor, context);
        }

        return function polyfillsTransformer(sourceFile: ts.SourceFile) {
            ts.visitNode(sourceFile, visitor);

            return sourceFile;
        };
    };
}
