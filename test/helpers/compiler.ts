// @ts-ignore
import * as Memoryfs from 'memory-fs';
import * as path from 'path';
import * as webpack from 'webpack';
import {Compiler, RuleSetRule, Stats, Configuration} from 'webpack';

export default function compile(filepath: string, options: {tsLoaders: RuleSetRule[]}): Promise<Stats> {
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
                            loader: 'raw-loader'
                        },
                        ...options.tsLoaders
                    ]
                }
            ]
        }
    } as Configuration);

    compiler.outputFileSystem = new Memoryfs() as any;

    return new Promise((resolve, reject) => {
        compiler.run((err: Error, stats: Stats) => {
            if (err || stats.hasErrors()) {
                return reject(err || new Error(stats.toString()));
            }

            resolve(stats);
        });
    });
}
