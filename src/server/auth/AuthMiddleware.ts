import { AuthService } from './AuthService';
import { Request, Response, NextFunction } from 'express';
import { getSessionUserId } from 'server/lib/sessionUtils';
import { ServiceError, ServiceErrorCode } from 'server/lib/ServiceError';
import { UserRole } from 'shared/ApiClient';
import { UserService } from 'server/user/UserService';

export class AuthMiddleware {
	public static getInstance(): AuthMiddleware {
		return this._instance || (this._instance = new AuthMiddleware)
	}

	private static _instance: AuthMiddleware;

	constructor(
		private userService = UserService.getInstance()
	) { }

	limitToRoles = (...roles: UserRole[]) => async (req: Request, res: Response, next: NextFunction) => {
		const userId = getSessionUserId(req);

		if (userId < 1) {
			next(new ServiceError('Unauthenticated', ServiceErrorCode.AUTHENTICATION_ERROR));
			return;
		}

		const containsRole = await this.userService.userRoleOneOf(userId, roles);

		if (!containsRole) {
			next(new ServiceError('Unauthenticated', ServiceErrorCode.AUTHENTICATION_ERROR));
			return;
		}

		next();
	}
}