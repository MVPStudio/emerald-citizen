import { ReportDao, ReportPersistence } from './ReportDao';
import { CreateReportRequest, CreateReportAddendumRequest, ReportAddendum } from 'shared/ApiClient';
import { handleDatabaseError } from '../lib/databaseUtils';

export class ReportService {
	public static getInstance() {
		return this._instance || (this._instance = new ReportService());
	}

	private static _instance: ReportService

	constructor(
		private reportDao: ReportDao = ReportDao.getInstance()
	) { }

	public findAll(): Promise<ReportPersistence[]> {
		return this.reportDao.findAll().catch(handleDatabaseError);
	}

	public findById(id: number): Promise<ReportPersistence | null> {
		return this.reportDao.findById(id).catch(handleDatabaseError);
	}

	public findByUserId(userId: number): Promise<ReportPersistence[]> {
		return this.reportDao.findByUserId(userId).catch(handleDatabaseError);
	}

	public async create(report: CreateReportRequest): Promise<ReportPersistence> {
		return this.reportDao.create(report).catch(handleDatabaseError);
	}

	public async addAddendum(req: CreateReportAddendumRequest): Promise<ReportAddendum> {
		return this.reportDao.addAddendum(req).catch(handleDatabaseError);
	}
}
