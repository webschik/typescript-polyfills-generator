const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const readdir = promisify(fs.readdir);
const polyfills = {
    'es6.fetch': 'whatwg-fetch'
};

module.exports = function generatePolyfills () {
    return readdir(path.resolve(__dirname, '../node_modules/core-js/modules')).then((files) => {
        files.forEach((filename) => {
            if (!filename.indexOf('es') && filename.indexOf('es5')) {
                polyfills[filename] = filename;
            }
        });

        return polyfills;
    });
};