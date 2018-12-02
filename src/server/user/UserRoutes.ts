import { UserService } from './UserService';
import { Router, Request, Response } from 'express';

export const getUserRoutes = (userService = UserService.getInstance()) =>
	Router()
		.get('', [
			(req: Request, res: Response) => res.sendPromise(userService.findPage(parseInt(req.query.page || 0, 10)))
		])
		.get('/:id', [
			(req: Request, res: Response) => res.sendPromise(userService.findById(parseInt(req.params.id, 10)))
		])
		.post('', [
			(req: Request, res: Response) => {
				// TODO: validation and type casting
				res.sendPromise(userService.create(req.body));
			}
		])
		.patch('/:id', [
			(req: Request, res: Response) => {
				// TODO: validation and type casting
				res.sendPromise(userService.update(parseInt(req.params.id, 10), req.body));
			}
		]);