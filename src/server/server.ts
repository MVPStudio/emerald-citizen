import * as express from 'express';
import * as compression from 'compression';
import { logger } from './logger';
import { getApiRouter } from './apiRouter';
import { getDbClientInstance } from './database/dbClient';
import { config } from './config';
import * as cluster from 'cluster';
import { join } from 'path';

const lusca = require('lusca');
const expressCluster = require('express-cluster');

export const shutdownServer = () => {
	logger.info('Server received a shutdown signal, closing database connections and shutting down...');
	getDbClientInstance().destroy();
	process.exit();
};

export const runServer = async () => {
	/**
	 * Configure server.
	 */
	const publicDirectory = join(__dirname, '..', 'public');
	const app = express()
		.use(compression())
		.use(lusca.xframe('SAMEORIGIN'))
		.use(lusca.xssProtection(true))
		.use(getApiRouter())
		.get('/favicon.ico', (_, res) => res.end())
		.use(express.static(publicDirectory))
		.get('*', (_, res) => res.sendfile(join(publicDirectory, 'index.html')));

	// this is required to make nodemon && concurrent actually stop the server process
	process.on('SIGINT', shutdownServer);
	process.on('SIGTERM', shutdownServer);

	/**
	 * Database migration.
	 */
	const dbClient = getDbClientInstance();

	logger.info(`Migrating database ${config.database.connection.database}.`);
	await dbClient.migrate.latest();
	logger.info(`Migrated to version ${await dbClient.migrate.currentVersion()}.`);

	/**
	 * Start server.
	 */
	await new Promise((resolve) => {
		app.listen(
			config.serverPort,
			() => {
				logger.debug(`App is running at http://localhost:${config.serverPort} in ${process.env.NODE_ENV} mode`)
				resolve()
			}
		);
	});
};

if (require.main === module) {
	if (config.isProduction && cluster.isMaster) {
		logger.info('Running in production, starting a worker per cpu.');
		expressCluster(
			runServer,
			{ count: config.workerCount }
		);
	} else {
		runServer();
	}
}
