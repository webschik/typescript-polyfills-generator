import * as Memoryfs from 'memory-fs';
import * as path from 'path';
import * as webpack from 'webpack';
import {Compiler, Stats} from 'webpack';
import {LoaderOptions} from '../../src/index';

export default function compile (filepath: string, options: {loaderOptions?: LoaderOptions} = {}): Promise<Stats> {
    const compiler: Compiler = webpack({
        context: __dirname,
        entry: filepath,
        mode: 'development',
        output: {
            path: path.resolve(__dirname),
            filename: 'bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[hash]',
                                emitFile: false
                            }
                        },
                        {
                            loader: path.resolve(__dirname, '../../src/index.ts'),
                            options: Object.assign({}, options.loaderOptions)
                        }
                    ]
                }
            ]
        }
    });

    compiler.outputFileSystem = new Memoryfs() as any;

    return new Promise((resolve, reject) => {
        compiler.run((err: Error, stats: Stats) => {
            if (err || stats.hasErrors()) {
                return reject(err || new Error(stats.toString()));
            }

            resolve(stats);
        });
    });
};