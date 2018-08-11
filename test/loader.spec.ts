import * as fs from 'fs';
import {promisify} from 'util';
import * as path from 'path';
import {Stats} from 'webpack';
import compile from './helpers/compiler';

const readFile = promisify(fs.readFile);

test(`Generates a polyfill file and doesn't change the source`, () => {
    const testFilePath: string = path.resolve(__dirname, './files/test-file-1.ts');

    return Promise.all([
        readFile(testFilePath, 'utf8'),
        compile(testFilePath, {
            loaderOptions: {
                targets: 'last 2 version, not ie < 11, not ie_mob < 11, safari >= 9'
            }
        })
    ]).then(([source, stats]: [string, Stats]) => {
        const output: string = stats.toJson().modules[0].source
            .replace(/(module\.exports = ")/, '$1\n')
            .replace(/\\n/g, '\n');

        expect(output).toBe(`module.exports = "\n${ source }"`);
        expect(output).toMatchSnapshot();
    });
});