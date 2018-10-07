module.exports = async function () {
    require('./register-ts-node').registerTsNode();

    const { setupDbClient } = require('../../database/setup/setupClient');

    await setupDbClient.destroy();
    await require('../../server').shutdownServer();
};