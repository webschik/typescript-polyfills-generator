import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import {promisify} from 'util';
import {Stats} from 'webpack';
import {createPolyfillsTransformerFactory} from '../src/index';
import compile from './helpers/compiler';

const readFile = promisify(fs.readFile);

xtest(`transformer with ts-loader`, () => {
    const testFilePath: string = path.resolve(__dirname, './files/test-file-1.ts');

    return Promise.all([
        readFile(testFilePath, 'utf8'),
        compile(testFilePath, {
            tsLoaders: [
                {
                    loader: 'ts-loader',
                    options: {
                        getCustomTransformers(program: ts.Program) {
                            return {
                                before: [
                                    createPolyfillsTransformerFactory(program, {
                                        targets: 'last 2 version, not ie < 11, not ie_mob < 11, safari >= 9'
                                    })
                                ]
                            };
                        }
                    }
                }
            ]
        })
    ]).then(([source, stats]: [string, Stats]) => {
        const output: string = stats
            .toJson()
            .modules[0].source.replace(/(module\.exports = ")/, '$1\n')
            .replace(/\\n/g, '\n');

        expect(output).toBe(`module.exports = "\n${source}"`);
        expect(output).toMatchSnapshot();
    });
});
