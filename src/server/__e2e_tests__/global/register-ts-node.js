const { join } = require('path');
const tsConfigPaths = require('tsconfig-paths');
const tsNode = require('ts-node');

module.exports = {
    registerTsNode: () => {
        // register ts-node  (jest doesn't do this for global setup scripts)
        tsConfigPaths.register();
        tsNode.register({ project: join(__dirname, '../../../../tsconfig.json'), register: tsConfigPaths });
    }
};