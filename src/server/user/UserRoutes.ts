import { UserService } from './UserService';
import { Router, Request, Response } from 'express';
import { AuthMiddleware } from 'server/auth/AuthMiddleware';
import { UserRole } from 'shared/ApiClient';

export const getUserRoutes = (
	userService = UserService.getInstance(),
	authMiddleware = AuthMiddleware.getInstance()
) =>
	Router()
		.get('', [
			authMiddleware.limitToRoles(UserRole.admin),
			(req: Request, res: Response) => res.sendPromise(userService.findPage(parseInt(req.query.page || 0, 10)))
		])
		.get('/:id', [
			authMiddleware.limitToRoles(UserRole.admin),
			(req: Request, res: Response) => res.sendPromise(userService.findById(parseInt(req.params.id, 10)))
		])
		.post('', [
			authMiddleware.limitToRoles(UserRole.admin),
			(req: Request, res: Response) => {
				res.sendPromise(userService.create(req.body));
			}
		])
		.patch('/:id', [
			authMiddleware.limitToRoles(UserRole.admin),
			(req: Request, res: Response) => {
				res.sendPromise(userService.update(parseInt(req.params.id, 10), req.body));
			}
		]);