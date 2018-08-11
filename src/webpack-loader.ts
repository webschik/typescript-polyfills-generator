import {getOptions, OptionObject} from 'loader-utils';
import * as validateOptions from 'schema-utils';
import {loader as webpackLoader} from 'webpack';
import {PolyfillsGenerator, PolyfillsGeneratorOptions} from './index';

export interface LoaderOptions extends PolyfillsGeneratorOptions, OptionObject {
    //
}

const loaderName: string = 'ts-polyfill-loader';
const loaderOptionsSchema = {
    type: 'object',
    properties: {
        targets: {
            type: 'string'
        }
    },
    additionalProperties: false
};
const generators: {[key: string]: PolyfillsGenerator} = Object.create(null);

export default function loader (this: webpackLoader.LoaderContext, source: string) {
    const options: LoaderOptions = getOptions(this) as LoaderOptions;

    validateOptions(loaderOptionsSchema, options, loaderName);
    const optionsKey: string = JSON.stringify(options);
    const callback = this.async() as webpackLoader.loaderCallback;

    if (!generators[optionsKey]) {
        generators[optionsKey] = new PolyfillsGenerator(options);
    }

    const generator: PolyfillsGenerator = generators[optionsKey];

    generator.process(source).then(() => {

    })

    callback(null, source);
}