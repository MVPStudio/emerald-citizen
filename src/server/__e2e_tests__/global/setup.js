module.exports = async function () {
    require('./register-ts-node').registerTsNode();

    const { runServer } = require('../../server');
    const { dropDatabase } = require('../../database/setup/dropDatabase');
    const { createDatabase } = require('../../database/setup/createDatabase');

    await dropDatabase();
    await createDatabase();
    await runServer();
};