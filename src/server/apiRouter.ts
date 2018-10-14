import { Router, Request, Response, NextFunction } from 'express';
import { healthCheck } from './healthCheck';
import { getUserRoutes } from './user/UserRoutes';
import { getReportRoutes } from './report/ReportRoutes';
import * as bodyParser from 'body-parser';
import sendPromise from './lib/middleware/sendPromise';
import { errorStatusCodes } from './lib/middleware/errorStatusCodes';
import { errorHandler } from './lib/middleware/errorHandler';
import { logger } from './logger';
import { getMeRoutes } from './me/MeRoutes';
import { getAuthRoutes } from './auth/AuthRoutes';

export const getApiRouter = () => {
	return Router()
		.use('/api', Router()
			.use(bodyParser.json())
			.use(bodyParser.urlencoded({ extended: true }))
			.use(sendPromise())
			.get('/health', healthCheck)
			.use(requestLogger)
			.use('/auth', getAuthRoutes())
			.use('/me', getMeRoutes())
			.use('/users', getUserRoutes())
			.use('/reports', getReportRoutes())
			.use(errorStatusCodes)
			.use(errorHandler)
		);
}

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
	const { method, originalUrl, params, query, body, headers } = req;
	const { password, ...bodyWithoutPassword } = body;
	const { cookie, ...headersWithoutCookie } = headers;

	logger.debug(JSON.stringify({ method, originalUrl, params, query, body: bodyWithoutPassword, headersWithoutCookie }));
	next();
}