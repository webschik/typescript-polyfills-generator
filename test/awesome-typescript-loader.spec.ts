import * as path from 'path';
import {Stats} from 'webpack';
import {createPolyfillsTransformerFactory} from '../src/index';
import compile from './helpers/compiler';
import prettifyWebpackOutput from './helpers/prettify-webpack-output';

test(`transformer with awesome-typescript-loader`, () => {
    const testFilePath: string = path.resolve(__dirname, './files/test-file-1.ts');

    return compile(testFilePath, {
        tsLoaders: [
            {
                loader: 'awesome-typescript-loader',
                options: {
                    transpileOnly: true,
                    getCustomTransformers() {
                        return {
                            before: [
                                createPolyfillsTransformerFactory({
                                    targets: 'ie 11, safari >= 9'
                                })
                            ]
                        };
                    }
                }
            }
        ]
    }).then((stats: Stats) => {
        const output: string = prettifyWebpackOutput(stats.toJson().modules[0].source);

        expect(output).toContainPolyfillImport('core-js/modules/es6.array.from.js');
        expect(output).toContainPolyfillImport('core-js/modules/es6.array.find.js');
        expect(output).toContainPolyfillImport('core-js/modules/es6.array.find-index.js');
        expect(output).toContainPolyfillImport('core-js/modules/es7.array.includes.js');
        expect(output).toContainPolyfillImport('core-js/modules/es6.string.includes.js');
        expect(output).toContainPolyfillImport('core-js/modules/es7.string.pad-start.js');
        expect(output).toContainPolyfillImport('core-js/modules/es7.string.pad-end.js');
        expect(output).toContainPolyfillImport('core-js/modules/es6.promise.js');
        expect(output).toContainPolyfillImport('whatwg-fetch');
        expect(output).toContainPolyfillImport('core-js/modules/es6.object.assign.js');
        expect(output).toContainPolyfillImport('core-js/modules/es6.number.is-nan.js');
        expect(output).toContainPolyfillImport('typescript-polyfills-generator/lib/polyfills/es5.array.unshift.js');
        expect(output).toContainPolyfillImport('typescript-polyfills-generator/lib/polyfills/es5.location.origin.js');
        expect(output).toMatchSnapshot();
    });
});

test(`transformer with awesome-typescript-loader, global Browserslist config and custom polyfills`, () => {
    const testFilePath: string = path.resolve(__dirname, './files/test-file-1.ts');

    return compile(testFilePath, {
        tsLoaders: [
            {
                loader: 'awesome-typescript-loader',
                options: {
                    transpileOnly: true,
                    getCustomTransformers() {
                        return {
                            before: [
                                createPolyfillsTransformerFactory({
                                    polyfills: {
                                        'es6.fetch': 'my-fetch-polyfill',
                                        'es6.object.assign': false
                                    }
                                })
                            ]
                        };
                    }
                }
            }
        ]
    }).then((stats: Stats) => {
        const output: string = prettifyWebpackOutput(stats.toJson().modules[0].source);

        expect(output).toContainPolyfillImport('core-js/modules/es6.array.from.js');
        expect(output).toContainPolyfillImport('core-js/modules/es6.array.find.js');
        expect(output).toContainPolyfillImport('core-js/modules/es6.array.find-index.js');
        expect(output).toContainPolyfillImport('core-js/modules/es7.array.includes.js');
        expect(output).toContainPolyfillImport('core-js/modules/es6.string.includes.js');
        expect(output).toContainPolyfillImport('core-js/modules/es7.string.pad-start.js');
        expect(output).toContainPolyfillImport('core-js/modules/es7.string.pad-end.js');
        expect(output).toContainPolyfillImport('core-js/modules/es6.promise.js');
        expect(output).toContainPolyfillImport('my-fetch-polyfill');
        expect(output).not.toContainPolyfillImport('core-js/modules/es6.object.assign.js');
        expect(output).toContainPolyfillImport('core-js/modules/es6.number.is-nan.js');
        expect(output).toContainPolyfillImport('typescript-polyfills-generator/lib/polyfills/es5.array.unshift.js');
        expect(output).toContainPolyfillImport('typescript-polyfills-generator/lib/polyfills/es5.location.origin.js');
        expect(output).toMatchSnapshot();
    });
});
