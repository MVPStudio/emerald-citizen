import { Router, Request, Response } from 'express';
import { AuthService } from './AuthService';

export const getAuthRoutes = (authService = AuthService.getInstance()) =>
	Router()
		.post('/login', [
			(req: Request, res: Response) => {
				res.sendPromise(authService.login(req.session as Express.Session, req.body));
			}
		])
		.post('/logout', [
			(req: Request, res: Response) => {
				res.sendPromise(authService.logout(req.session as Express.Session));
			}
		]);
