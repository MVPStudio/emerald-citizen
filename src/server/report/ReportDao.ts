import * as Knex from 'knex';
import { getDbClientInstance } from '../database/dbClient';
import { TimestampedPersistence } from '../lib/TimestampedPersistence';

export class ReportDao {
	public static getInstance() {
		return this._instance || (this._instance = new ReportDao());
	}

	private static _instance: ReportDao;
	public static tableName = 'report';
	public static vehicleTableName = 'vehicle';
	public static personTableName = 'person';
	public static addendumTableName = 'report_addendum';
	public static fileTableName = 'report_file';

	static reportSearchColumns = ['details', 'location']
	static personSearchColumns = ['name', 'sex', 'details'];
	static vehicleSearchColumns = ['make', 'model', 'color', 'license_plate', 'details'];
	static addendumSearchColumns = ['text'];

	constructor(
		private dbClient: Knex = getDbClientInstance()
	) { }

	public async findAll(): Promise<ReportDetailsPersistence[]> {
		return this.dbClient(ReportDao.tableName).select('*');
	}

	public async findSortedPage(page: number, limit: number = 50): Promise<ReportPagePersistence[]> {
		return this.dbClient(ReportDao.tableName)
			.select('*')
			.orderBy('updated', 'DESC')
			.offset(page * limit)
			.limit(limit);
	}

	public async findById(id: number): Promise<ReportDetailsPersistence | null> {
		const report = await this.dbClient(ReportDao.tableName)
			.where({ id })
			.first();

		if (report == null) {
			return null;
		}

		const [people, vehicles, addendums, files] = await Promise.all([
			this.dbClient(ReportDao.personTableName).select('*').where({ report_id: id }),
			this.dbClient(ReportDao.vehicleTableName).select('*').where({ report_id: id }),
			this.dbClient(ReportDao.addendumTableName).select('*').where({ report_id: id }),
			this.dbClient(ReportDao.fileTableName).select('*').where({ report_id: id })
		]);

		return {
			...report,
			people,
			vehicles,
			addendums,
			files
		};
	}

	public async findByUserId(userId: number): Promise<ReportDetailsPersistence[]> {
		return this.dbClient(ReportDao.tableName).select('*').where({ user_id: userId });
	}

	public async create(report: CreateReportPersistence): Promise<ReportDetailsPersistence> {
		const id = await this.dbClient.transaction(async (trx) => {
			const { people, vehicles, files, ...r } = report;
			const savedReport = await this.dbClient(ReportDao.tableName)
				.transacting(trx)
				.insert(r)
				.returning('*')
				.get(0);
			const withReportId = (item: any) => ({ ...item, report_id: savedReport.id });

			if (people != null) {
				await this.dbClient.batchInsert(ReportDao.personTableName, people.map(withReportId)).transacting(trx);
			}

			if (vehicles != null) {
				await this.dbClient.batchInsert(ReportDao.vehicleTableName, vehicles.map(withReportId)).transacting(trx);
			}

			if (files != null) {
				await this.dbClient.batchInsert(ReportDao.fileTableName, files.map(withReportId)).transacting(trx);
			}

			return savedReport.id;
		});

		const createdReport = await this.findById(id);

		if (createdReport == null) {
			throw new Error('Report lookup failed after creation!');
		}

		return createdReport;
	}

	public async addAddendum(req: CreateReportAddendumPersistence) {
		return await this.dbClient.transaction(async (trx) => {
			const addendum = await this.dbClient(ReportDao.addendumTableName)
				.transacting(trx)
				.insert(req)
				.returning('*')
				.get(0);

			await this.dbClient(ReportDao.tableName)
				.transacting(trx)
				.update({
					updated: new Date()
				})
				.where({ id: req.report_id });

			return addendum;
		});

	}

	public async toggleMarkedInteresting(id: number, userId: number): Promise<void> {
		const now = new Date();

		await this.dbClient(ReportDao.tableName)
			.update({
				marked_interesting: this.dbClient.raw('NOT marked_interesting'),
				marked_interesting_dt_tm: now,
				marked_interesting_user_id: userId,
				updated: now
			})
			.where({ id });
	}

	public async toggleMarkedValidated(id: number, userId: number): Promise<void> {
		const now = new Date();

		await this.dbClient(ReportDao.tableName)
			.update({
				marked_validated: this.dbClient.raw('NOT marked_validated'),
				marked_validated_dt_tm: now,
				marked_validated_user_id: userId,
				updated: now
			})
			.where({ id });
	}

	// private searchTable(tableName: string, columns: string[], expression: string, select?: string) {
	// 	return columns.reduce(
	// 		(query, columnName, index) => {
	// 			return query[index === 0 ? 'where' : 'orWhere'](
	// 				columnName,
	// 				'ILIKE',
	// 				expression
	// 			)
	// 		},
	// 		this.dbClient(tableName).select(select || '*')
	// 	);
	// }

	// public async search(term: string): Promise<ReportDetailsPersistence[]> {
	// 	const searchTermExpression = `%${term}%`;

	// 	// tslint:disable max-line-length
	// 	return this.searchTable(ReportDao.tableName, ReportDao.reportSearchColumns, searchTermExpression)
	// 		.orWhereIn(
	// 			'id',
	// 			this.searchTable(ReportDao.addendumTableName, ReportDao.addendumSearchColumns, searchTermExpression, 'report_id')
	// 		);
	// 	// .orWhereIn(
	// 	// 	'id',
	// 	// 	this.dbClient
	// 	// 		.select('report_id')
	// 	// 		.from(ReportDao.addendumTableName)
	// 	// 		.whereRaw(
	// 	// 			this.dbClient.raw(`to_tsvector('english', text) @@ ${searchTermExpression}`)
	// 	// 		)
	// 	// )
	// 	// .orWhereIn(
	// 	// 	'id',
	// 	// 	(builder) =>
	// 	// 		builder.select('report_id')
	// 	// 			.from(ReportDao.personTableName)
	// 	// 			.where(
	// 	// 				'to_tsvector('english', name || ' ' || age || ' ' || height || ' ' || weight || ' ' || hair_color || ' ' || hair_length || ' ' || eye_color || ' ' || skin_color || ' ' || sex || ' ' || details || ' ' || category)',
	// 	// 				'@@',
	// 	// 				searchTermExpression
	// 	// 			)
	// 	// )
	// 	// .orWhereIn(
	// 	// 	'id',
	// 	// 	(builder) =>
	// 	// 		builder.select('report_id')
	// 	// 			.from(ReportDao.vehicleTableName)
	// 	// 			.where(
	// 	// 				'to_tsvector('english', make || ' ' || model || ' ' || color || ' ' || license_plate || ' ' || details)',
	// 	// 				'@@',
	// 	// 				searchTermExpression
	// 	// 			)
	// 	// )
	// }
}

export interface CreateReportPersistence {
	user_id: number;
	date?: string;
	location?: string;
	room_number?: string;
	details?: string;
	geo_latitude?: number;
	geo_longitude?: number;
	people?: CreatePersonPersistence[];
	vehicles?: CreateVehiclePersistence[];
	files?: CreateFilePersistence[];
}

export interface ReportPersistence extends CreateReportPersistence, TimestampedPersistence {
	id: number;
	marked_interesting: boolean;
	marked_validated: boolean;
	marked_interesting_dt_tm: Date;
	marked_interesting_user_id: number;
	marked_validated_dt_tm: Date;
	marked_validated_user_id: number;
}

export interface ReportDetailsPersistence extends ReportPersistence {
	people: PersonPersistence[];
	vehicles: VehiclePersistence[];
	files: FilePersistence[];
	addendums: ReportAddendumPersistence[];
}

export interface ReportPagePersistence extends ReportPersistence {
	last_addendum_dt_tm: Date;
	sort_dt_tm: Date;
}

export interface CreateVehiclePersistence {
	make: string | null;
	model: string | null;
	color: string | null;
	license_plate: string | null;
}

export interface VehiclePersistence extends CreateVehiclePersistence, TimestampedPersistence {
	id: number;
	report_id: number;
}

export enum PersonCategory {
	suspicious_person = 'suspicious_person',
	buyer = 'buyer',
	victim = 'victim'
}

export enum PersonSex {
	male = 'male',
	female = 'female',
	unsure = 'unsure'
}

export interface CreatePersonPersistence {
	name: string | null;
	height: string | null;
	age: string | null;
	weight: string | null;
	hair_color: string | null;
	hair_length: string | null;
	eye_color: string | null;
	skin_color: string | null;
	sex: PersonSex | null;
	details: string | null;
	category: PersonCategory;
}

export interface PersonPersistence extends CreatePersonPersistence, TimestampedPersistence {
	id: number;
	report_id: number;
}

export interface CreateReportAddendumPersistence {
	report_id: number;
	text: string;
}

export interface ReportAddendumPersistence extends CreateReportAddendumPersistence, TimestampedPersistence {
	id: number;
}

export interface CreateFilePersistence {
	filename: string;
}

export interface FilePersistence extends CreateFilePersistence, TimestampedPersistence {
	id: number;
}