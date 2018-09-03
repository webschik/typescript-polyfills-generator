const path = require('path');
const {updateThresholds} = require('jest-coverage-processor');

module.exports = function(results) {
    return updateThresholds(results, {
        packagePath: path.resolve(__dirname, '../package.json')
    });
};
