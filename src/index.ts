// @ts-ignore
import * as browserslist from 'browserslist';
import * as ts from 'typescript';
import normalizeBuiltInName from './normalize-built-in-name';
import semverify from './semverify';

interface BrowsersSupportList {
    // [browser name]: version
    [key: string]: string;
}

interface BuiltInsList {
    // [name]:
    [key: string]: BrowsersSupportList;
}

export type PolyfillStatusOrVersion = boolean|string|'all';

export interface PolyfillsList {
    [key: string]: PolyfillStatusOrVersion;
}

export interface PolyfillsGeneratorOptions {
    targets?: string;
    polyfills?: PolyfillsList;
}

const {hasOwnProperty} = Object.prototype;
const allBuiltInsWithEsVersion: BuiltInsList = require('../data/built-ins.json');
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

        allBuiltIns[normalizeBuiltInName(builtIn)] = normalizedBrowsersList;
    }
}

// export class PolyfillsGenerator {
//     private targets: string[];
//
//     constructor(options: PolyfillsGeneratorOptions) {
//         this.targets = browserslist(options.targets);
//     }
//
//     process(fileName: string, sourceText: string): Promise<string> {
//         const program: ts.Program = ts.createProgram([fileName], {});
//         const checker: ts.TypeChecker = program.getTypeChecker();
//
//         for (const sourceFile of program.getSourceFiles()) {
//             if (!sourceFile.isDeclarationFile) {
//                 ts.forEachChild(sourceFile, onNode);
//             }
//         }
//
//         function onNode(node: ts.Node) {
//             const symbol: ts.Symbol | void = checker.getSymbolAtLocation(node);
//
//             if (symbol) {
//                 console.log(
// checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration
// !)));
//             }
//
//             ts.forEachChild(node, onNode);
//         }
//
//         return Promise.resolve(sourceText);
//     }
// }

export function createPolyfillsTransformerFactory (
    program: ts.Program,
    options: PolyfillsGeneratorOptions = {}
): ts.TransformerFactory<ts.SourceFile> {
    const targets: {[key: string]: any} = Object.create(null);
    const polyfillsConfig: PolyfillsList = options.polyfills as PolyfillsList;
    const polyfills: PolyfillsList = Object.create(null);

    for (const builtIn in polyfillsConfig) {
        if (hasOwnProperty.call(polyfillsConfig, builtIn)) {
            const statusOrVersion: PolyfillStatusOrVersion = polyfillsConfig[builtIn];

            polyfills[normalizeBuiltInName(builtIn)] =
                statusOrVersion === allVersionsKey ?
                    // "first" version
                    '0.0.1' :
                    (statusOrVersion === true || statusOrVersion === false) ?
                        statusOrVersion :
                        semverify(statusOrVersion as string);

        }
    }

    browserslist(options.targets).forEach((browser: string) => {
        const [browserName, browserVersion] = browser.split(' ');
        const normalizedBrowserName: string = browserNameMap[browserName] || browserName;
        const splitVersion: string = browserVersion.split('-')[0].toLowerCase();

        targets[normalizedBrowserName] = splitVersion === allVersionsKey ? splitVersion : semverify(splitVersion);
    });

    return function polyfillsTransformerFactory (context: ts.TransformationContext): ts.Transformer<ts.SourceFile> {
        function visitor (node: ts.Node): ts.Node {
            return ts.visitEachChild(node, visitor, context);
        }

        return function polyfillsTransformer (sourceFile: ts.SourceFile) {
            ts.visitNode(sourceFile, visitor);

            return sourceFile;
        };
    };
}