module.exports = async function () {
	require('./register-ts-node').registerTsNode();

	const { runServer } = require('../../server');
	const { dropDatabase } = require('../../database/setup/dropDatabase');
	const { createDatabase } = require('../../database/setup/createDatabase');
	const { logger } = require('../../logger');

	await dropDatabase();
	await createDatabase();
	await runServer();

	logger.debug('********************************************************');
	logger.debug('********************************************************');
	logger.debug('******************** TESTS STARTING ********************');
	logger.debug('********************************************************');
	logger.debug('********************************************************');
};