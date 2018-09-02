import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import {promisify} from 'util';
import {Stats} from 'webpack';
import {createPolyfillsTransformerFactory} from '../src/index';
import compile from './helpers/compiler';

const readFile = promisify(fs.readFile);

test(`transformer with awesome-typescript-loader`, () => {
    const testFilePath: string = path.resolve(__dirname, './files/test-file-1.ts');

    return Promise.all([
        readFile(testFilePath, 'utf8'),
        compile(testFilePath, {
            tsLoaders: [
                {
                    loader: 'awesome-typescript-loader',
                    options: {
                        getCustomTransformers(program: ts.Program) {
                            return {
                                before: [
                                    createPolyfillsTransformerFactory(program, {
                                        targets: 'ie 11'
                                    })
                                ]
                            };
                        }
                    }
                }
            ]
        })
    ]).then(([source, stats]: [string, Stats]) => {
        const output: string = stats.toJson().modules[0].source;

        expect(output).toBe(`module.exports = "\n${source}"`);
        expect(output).toMatchSnapshot();
    });
});
