import { ReportDao, ReportPersistence } from './ReportDao';
import { CreateReportRequest, CreateReportAddendumRequest, ReportAddendum, Report, ReportFile } from 'shared/ApiClient';
import { handleDatabaseError } from '../lib/databaseUtils';
import { MediaService } from 'server/media/MediaService';

export class ReportService {
	public static getInstance() {
		return this._instance || (this._instance = new ReportService());
	}

	private static _instance: ReportService

	constructor(
		private reportDao: ReportDao = ReportDao.getInstance(),
		private mediaService: MediaService = MediaService.getInstance()
	) { }

	public findAll(): Promise<ReportPersistence[]> {
		return this.reportDao.findAll().catch(handleDatabaseError);
	}

	public async findById(id: number): Promise<Report | null> {
		const reportPersistence = await this.reportDao.findById(id).catch(handleDatabaseError);

		if (reportPersistence == null) {
			return null;
		}

		const files: ReportFile[] = [];

		for (const file of reportPersistence.files) {
			files.push({
				...file,
				url: await this.mediaService.getSignedUrl(file.filename)
			});
		}

		return {
			...reportPersistence,
			files
		};
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
