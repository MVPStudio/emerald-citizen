import { Request, RequestHandler, Response, NextFunction } from 'express';
import { getDbClientInstance } from './database/dbClient';
import { ServiceError, ServiceErrorCode } from './lib/ServiceError';
import { logger } from './logger';

// A health check that verifies the database connection is still working
export const healthCheck: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await getDbClientInstance().raw('SELECT 1 = 1');
	} catch (e) {
		logger.error(e);
		next(new ServiceError('Database Connection Error!', ServiceErrorCode.SERVER_ERROR));
		return;
	}

	res.status(200).end();
};
