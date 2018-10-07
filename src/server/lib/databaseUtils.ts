import { logger } from 'server/logger';
import { ServiceError, ServiceErrorCode } from './ServiceError';

export const handleDatabaseError = (err: Error) => {
	logger.error(err.stack || err.message);
	throw new ServiceError('Database Error', ServiceErrorCode.SERVER_ERROR);
}