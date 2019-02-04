import * as dotenv from 'dotenv';
import { cpus } from 'os';

/**
 * Load environment variables from .env file.
 */
dotenv.config();

const getEnvString = (name: string): string => process.env[name] || '';
const getEnvNumber = (name: string): number => parseInt(getEnvString(name), 10);
const getEnvBoolean = (name: string): boolean => getEnvString(name) === 'true';
const isProduction = process.env.NODE_ENV === 'production';
const workerCount = getEnvNumber('WORKER_COUNT') || cpus().length;

export const config = {
	isDevelopment: process.env.NODE_ENV === 'development',
	isProduction,
	isTest: process.env.NODE_ENV === 'test',
	serverPort: getEnvNumber('SERVER_PORT') || 8080,
	workerCount,
	sessionSecret: getEnvString('SESSION_SECRET'),
	assumeRole: getEnvBoolean('ASSUME_ROLE'),
	s3Bucket: getEnvString('S3_BUCKET'),
	googleMapsApiKey: getEnvString('GOOGLE_MAPS_WEB_API_KEY'),
	database: {
		client: 'pg',
		acquireConnectionTimeout: getEnvNumber('DATABASE_ACQUIRE_CONNECTION_TIMEOUT'),
		connection: {
			debug: getEnvBoolean('DATABASE_DEBUG'),
			host: getEnvString('DATABASE_HOST'),
			user: getEnvString('DATABASE_USER'),
			password: getEnvString('DATABASE_PASSWORD'),
			database: getEnvString('DATABASE_NAME'),
			requestTimeout: getEnvNumber('DATABASE_REQUEST_TIMEOUT')
		},
		pool: {
			min: getEnvNumber('DATABASE_POOL_MIN'),
			max: getEnvNumber('DATABASE_POOL_MAX')
		},
		migrations: {
			directory: './src/server/database/migrations',
			tableName: 'migrations'
		}
	}
};
