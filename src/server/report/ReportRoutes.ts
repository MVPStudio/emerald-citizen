import { ReportService } from './ReportService';
import { Router, Request, Response } from 'express';
import { CreateReportRequest, CreateReportAddendumRequest } from 'shared/ApiClient';
import { getSessionUserId } from '../lib/sessionUtils';

export const getReportRoutes = (reportService = ReportService.getInstance()) =>
	Router()
		.get('', [
			(_: Request, res: Response) => res.sendPromise(reportService.findAll())
		])
		.get('/:id', [
			(req: Request, res: Response) => res.sendPromise(reportService.findById(parseInt(req.params.id, 10)))
		])
		.post('', [
			(req: Request, res: Response) => {
				const reportReq = { ...req.body, user_id: getSessionUserId(req) } as CreateReportRequest;

				res.sendPromise(reportService.create(reportReq));
			}
		])
		.post('/:id/addendum', [
			(req: Request, res: Response) => {
				const addendum: CreateReportAddendumRequest = {
					report_id: parseInt(req.params.id, 10),
					text: req.body.text as string
				};

				res.sendPromise(reportService.addAddendum(addendum));
			}
		]);