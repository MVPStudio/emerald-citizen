import * as winston from 'winston';
import { config } from './config';

const defaultLoggingConfig = {
	transports: [
		new (winston.transports.Console)({
			level: 'debug',
			handleExceptions: false,
			prettyPrint: true,
			silent: false,
			timestamp: true,
			colorize: true,
			json: false
		})
	]
};

const productionLoggingConfig = {
	transports: [
		new (winston.transports.Console)({
			level: 'debug',
			handleExceptions: false,
			prettyPrint: true,
			timestamp: true
		})
	]
};

export const logger = new winston.Logger(config.isProduction ? productionLoggingConfig : defaultLoggingConfig);

export const serviceLogger = (Service: { name: string }) => {
	return {
		error: (msg: string) => logger.error(`${Service.name}: ${msg}`),
		warn: (msg: string) => logger.warn(`${Service.name}: ${msg}`),
		help: (msg: string) => logger.help(`${Service.name}: ${msg}`),
		data: (msg: string) => logger.data(`${Service.name}: ${msg}`),
		info: (msg: string) => logger.info(`${Service.name}: ${msg}`),
		debug: (msg: string) => logger.debug(`${Service.name}: ${msg}`)
	}
}