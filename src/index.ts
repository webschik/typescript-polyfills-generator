import {getOptions, OptionObject} from 'loader-utils';
import * as validateOptions from 'schema-utils';
import {loader as webpackLoader} from 'webpack';

export interface LoaderOptions extends OptionObject {
    filename: string;
    browsers?: string;
}

const loaderName: string = 'ts-polyfill-loader';

const loaderOptionsSchema = {
    type: 'object',
    properties: {
        filename: {
            type: 'string'
        },
        browsers: {
            type: 'string'
        }
    },
    additionalProperties: false
};

export default function loader (this: webpackLoader.LoaderContext, source: string) {
    const options: LoaderOptions = getOptions(this) as LoaderOptions;

    validateOptions(loaderOptionsSchema, options, loaderName);
    const callback = this.async() as webpackLoader.loaderCallback;

    if (!options.filename) {
        return callback(new Error(`[${ loaderName }]: \`filename\` option is missing`));
    }

    callback(null, source);
}