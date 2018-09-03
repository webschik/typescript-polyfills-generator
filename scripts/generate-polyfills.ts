const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const features = require('../data/built-in-features');
const writeFile = promisify(fs.writeFile);
const polyfills = Object.create(null);

Object.keys(features)
    .sort()
    .forEach((feature) => {
        if (feature === 'es6.fetch') {
            polyfills[feature] = 'whatwg-fetch';
        } else {
            polyfills[feature] = `core-js/modules/${feature}.js`;
        }
    });

writeFile(path.resolve(__dirname, '../data/polyfills.json'), JSON.stringify(polyfills, null, 2)).catch(console.error);
