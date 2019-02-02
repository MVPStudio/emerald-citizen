import { ReportService } from './ReportService';
import { Router, Request, Response } from 'express';
import { CreateReportRequest, CreateReportAddendumRequest, UserRole } from 'shared/ApiClient';
import { getSessionUserId } from '../lib/sessionUtils';
import { AuthMiddleware } from 'server/auth/AuthMiddleware';

export const getReportRoutes = (
	reportService = ReportService.getInstance(),
	authMiddleware = AuthMiddleware.getInstance()
) =>
	Router()
		.get('', [
			authMiddleware.limitToRoles(UserRole.admin, UserRole.analyst),
			(req: Request, res: Response) => res.sendPromise(reportService.findSortedPage(parseInt(req.query.page || 0, 10)))
		])
		.get('/:id', [
			authMiddleware.limitToRoles(UserRole.admin, UserRole.analyst),
			(req: Request, res: Response) => res.sendPromise(reportService.findById(parseInt(req.params.id, 10)))
		])
		.post('', [
			authMiddleware.limitToRoles(UserRole.admin, UserRole.reporter),
			(req: Request, res: Response) => {
				const reportReq = { ...req.body, user_id: getSessionUserId(req) } as CreateReportRequest;

				res.sendPromise(reportService.create(reportReq));
			}
		])
		.post('/:id/addendum', [
			authMiddleware.limitToRoles(UserRole.reporter),
			(req: Request, res: Response) => {
				const addendum: CreateReportAddendumRequest = {
					report_id: parseInt(req.params.id, 10),
					text: req.body.text as string
				};

				res.sendPromise(reportService.addAddendum(getSessionUserId(req), addendum));
			}
		])
		.post('/:id/toggle_interesting', [
			authMiddleware.limitToRoles(UserRole.admin, UserRole.analyst),
			(req: Request, res: Response) => {
				res.sendPromise(reportService.toggleMarkedInteresting(req.params.id, getSessionUserId(req)));
			}
		])
		.post('/:id/toggle_validated', [
			authMiddleware.limitToRoles(UserRole.admin, UserRole.analyst),
			(req: Request, res: Response) => {
				res.sendPromise(reportService.toggleMarkedValidated(req.params.id, getSessionUserId(req)));
			}
		])
		.post('/search', [
			authMiddleware.limitToRoles(UserRole.admin, UserRole.analyst),
			(req: Request, res: Response) => {
				res.sendPromise(reportService.searchReports(req.body));
			}
		]);