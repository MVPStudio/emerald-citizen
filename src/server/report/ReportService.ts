import { ReportDao, ReportDetailsPersistence, ReportPersistence } from './ReportDao';
import {
	CreateReportRequest,
	CreateReportAddendumRequest,
	ReportAddendum,
	ReportDetails,
	ReportFile,
	SearchReportsRequest,
	Report
} from 'shared/ApiClient';
import { handleDatabaseError } from '../lib/databaseUtils';
import { MediaService } from 'server/media/MediaService';
import { UserService, SanitizedUser } from 'server/user/UserService';
import { ServiceError, ServiceErrorCode } from 'server/lib/ServiceError';

export class ReportService {
	public static getInstance() {
		return this._instance || (this._instance = new ReportService());
	}

	private static _instance: ReportService

	constructor(
		private reportDao: ReportDao = ReportDao.getInstance(),
		private mediaService: MediaService = MediaService.getInstance(),
		private userService: UserService = UserService.getInstance()
	) { }

	public findAll(): Promise<ReportDetailsPersistence[]> {
		return this.reportDao.findAll().catch(handleDatabaseError);
	}

	public async findSortedPage(page: number = 0): Promise<Report[]> {
		const reports = await this.reportDao.findSortedPage(page).catch(handleDatabaseError);
		const userIds = reports.map(report => report.user_id);
		const users = await this.userService.findByIds(userIds);

		return reports.map<Report>(report => ({
			...report,
			user: users.find(user => user.id === report.user_id) as SanitizedUser
		}));
	}

	public async findById(id: number): Promise<ReportDetails | null> {
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

		const user = await this.userService.findById(reportPersistence.user_id);

		if (user == null) {
			throw new ServiceError('Could not find user for report!', ServiceErrorCode.SERVER_ERROR);
		}

		return {
			...reportPersistence,
			files,
			user,
			marked_interesting_user: await this.userService.findById(reportPersistence.marked_interesting_user_id),
			marked_validated_user: await this.userService.findById(reportPersistence.marked_validated_user_id)
		};
	}

	public findByUserId(userId: number): Promise<ReportDetailsPersistence[]> {
		return this.reportDao.findByUserId(userId).catch(handleDatabaseError);
	}

	public async create(report: CreateReportRequest): Promise<ReportDetailsPersistence> {
		return this.reportDao.create(report).catch(handleDatabaseError);
	}

	public async addAddendum(req: CreateReportAddendumRequest): Promise<ReportAddendum> {
		return this.reportDao.addAddendum(req).catch(handleDatabaseError);
	}

	public async toggleMarkedInteresting(id: number, userId: number): Promise<void> {
		await this.reportDao.toggleMarkedInteresting(id, userId);
	}

	public async toggleMarkedValidated(id: number, userId: number): Promise<void> {
		await this.reportDao.toggleMarkedValidated(id, userId);
	}

	public async searchReports(req: SearchReportsRequest) {
		return this.reportDao.searchReports(req);
	}
}
