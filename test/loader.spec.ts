import * as path from 'path';
import {Stats} from 'webpack';
import compile from './helpers/compiler';

test(`Generates a polyfill file and doesn't change the source`, () => {
    const testFilePath: string = path.resolve(__dirname, './files/test-file-1.ts');

    return compile(testFilePath).then((stats: Stats) => {
        const output: string = stats.toJson().modules[0].source;

        expect(output).toBe('module.exports = __webpack_public_path__ + "e01cb1fb1dc5da428d597611384bbf0e";');
    });
});