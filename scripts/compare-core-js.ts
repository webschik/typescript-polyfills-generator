const fs = require('fs');
const {promisify} = require('util');
const polyfills = require('../data/polyfills');

promisify(fs.readdir)('../node_modules/core-js/modules')
    .then((files: string[]) => {
        files.forEach((filename: string) => {
            const feature = filename.replace('.js', '');

            if (/^es[67]\./.test(feature) && !polyfills[feature]) {
                console.log('---', feature);
            }
        });
    })
    .catch(console.error);
