import * as fs from 'fs';
import * as path from 'path';
import {promisify} from 'util';
import {Stats} from 'webpack';
import {createPolyfillsTransformerFactory} from '../src/index';
import compile from './helpers/compiler';

const readFile = promisify(fs.readFile);

test(`transformer with ts-loader`, () => {
    const testFilePath: string = path.resolve(__dirname, './files/test-file-1.ts');

    return Promise.all([
        readFile(testFilePath, 'utf8'),
        compile(testFilePath, {
            tsLoaders: [
                {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        getCustomTransformers() {
                            return {
                                before: [
                                    createPolyfillsTransformerFactory({
                                        targets: 'last 2 version, not ie < 11, not ie_mob < 11, safari >= 9'
                                    })
                                ]
                            };
                        }
                    }
                }
            ]
        })
    ] as any).then(([source, stats]: [string, Stats]) => {
        const output: string = stats
            .toJson()
            .modules[0].source.replace(/\\n/g, '\n')
            .replace(/\\"/g, `'`);

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
