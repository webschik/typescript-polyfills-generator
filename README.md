# typescript-polyfills-generator
[![Build Status](https://secure.travis-ci.org/webschik/typescript-polyfills-generator.png?branch=master)](https://travis-ci.org/webschik/typescript-polyfills-generator)
[![npm](https://img.shields.io/npm/dm/typescript-polyfills-generator.svg)](https://www.npmjs.com/package/typescript-polyfills-generator)
[![npm](https://img.shields.io/npm/v/typescript-polyfills-generator.svg)](https://www.npmjs.com/package/typescript-polyfills-generator)
[![npm](https://img.shields.io/npm/l/typescript-polyfills-generator.svg)](https://www.npmjs.com/package/typescript-polyfills-generator)
[![Coverage Status](https://coveralls.io/repos/github/webschik/typescript-polyfills-generator/badge.svg?branch=master)](https://coveralls.io/github/webschik/typescript-polyfills-generator?branch=master)

> Runtime polyfills generator for TypeScript projects, inspired by [@babel/preset-env](https://github.com/babel/babel/tree/master/packages/babel-preset-env)

## TLDR
This module solves [https://github.com/Microsoft/TypeScript/issues/20095](https://github.com/Microsoft/TypeScript/issues/20095)

## Problem
If you do not use [Babel](https://github.com/babel/babel) in your development process (as I do), but you still want to have a flexible way to
include polyfills based on [browserslist](https://github.com/browserslist/browserslist) config (as [@babel/preset-env](https://github.com/babel/babel/tree/master/packages/babel-preset-env) does)
this module comes to rescue.

## Usage
### Requirements
* Node.js v10.3.0+

### Installation
```shell
npm i --save-dev typescript-polyfills-generator
```

### Webpack integration
#### 1. Create a transformers file
```js
// webpack.ts-transformers.js
const {createPolyfillsTransformerFactory} = require('typescript-polyfills-generator');
const getCustomTransformers = () => {
  return {
      before: [
          createPolyfillsTransformerFactory({
              targets: 'last 2 version, not ie < 11, not ie_mob < 11, safari >= 9'
          })
      ]
  };
};

module.exports = getCustomTransformers;
```
##### Options:
**- targets** - optional, you may use [any valid Browserslist config](https://github.com/browserslist/browserslist#packagejson)

**- polyfills** - optional, you may specify a custom list of polyfills:

```js
createPolyfillsTransformerFactory({
    polyfills: {
        'es6.fetch': 'my-polyfills-module', // import from 'my-polyfills-module'; will be added if Fetch API is not supported by your targets
        'es6.object.assign': false // never include polyfill for Object.assign
    }
})
```

#### 2. Specify a path to transformers file in TS loader
```js
const path = require('path');

// Your webpack config...
{
    test: /\.tsx?$/,
    use: [
        {
            loader: 'ts-loader', // or 'awesome-typescript-loader'
            options: {
                getCustomTransformers: path.join(__dirname, './webpack.ts-transformers.js')
            }
        }
    ]
}
```

## Examples
Check my [awesome-typescript-loader](test/awesome-typescript-loader.spec.ts) and [ts-loader](test/ts-loader.spec.ts) test cases
to see how this module works.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments
This module **would not be possible** if not for a number of awesome open-source projects, like 

* [@babel/preset-env](https://github.com/babel/babel/tree/master/packages/babel-preset-env)
* [browserslist](https://github.com/browserslist/browserslist)
* [compat-table](https://github.com/kangax/compat-table)
* [electron-to-chromium](https://github.com/Kilian/electron-to-chromium)
* [ts-loader](https://github.com/TypeStrong/ts-loader)
* [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader)