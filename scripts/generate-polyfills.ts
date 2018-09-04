const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const features = require('../data/built-in-features');
const writeFile = promisify(fs.writeFile);
const polyfills = {
    'es6.fetch': 'whatwg-fetch',
    'es5.array.unshift': 'typescript-polyfills-generator/lib/polyfills/es5.array.unshift.js',
    'es5.location.origin': 'typescript-polyfills-generator/lib/polyfills/es5.location.origin.js'
};

polyfills['es5.array.shift'] = polyfills['es5.array.unshift'];

Object.keys(features)
    .sort()
    .forEach((feature) => {
        polyfills[feature] = `core-js/modules/${feature}.js`;
    });

writeFile(path.resolve(__dirname, '../data/polyfills.json'), JSON.stringify(polyfills, null, 2)).catch(console.error);
