import { ReportService } from 'server/report/ReportService';
import { Router, Request, Response } from 'express';
import { UserService } from 'server/user/UserService';
import { getSessionUserId } from '../lib/sessionUtils';

export const getMeRoutes = (reportService = ReportService.getInstance(), userService = UserService.getInstance()) =>
	Router()
		.get('', [
			(req: Request, res: Response) => {
				res.sendPromise(userService.findById(getSessionUserId(req)));
			}
		])
		.get('/reports', [
			(req: Request, res: Response) => {
				res.sendPromise(reportService.findByUserId(getSessionUserId(req)));
			}
		])
		.post('/update-password', [
			(req: Request, res: Response) => {
				const { password } = req.body;
				res.sendPromise(userService.update(getSessionUserId(req), { password }).then(() => undefined));
			}
		]);
