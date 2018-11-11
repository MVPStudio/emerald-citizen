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

	constructor(
		private dbClient: Knex = getDbClientInstance()
	) { }

	public async findAll(): Promise<ReportPersistence[]> {
		return this.dbClient(ReportDao.tableName).select('*');
	}

	public async findById(id: number): Promise<ReportPersistence | null> {
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

	public async findByUserId(userId: number): Promise<ReportPersistence[]> {
		return this.dbClient(ReportDao.tableName).select('*').where({ user_id: userId });
	}

	public async create(report: CreateReportPersistence): Promise<ReportPersistence> {
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
		return this.dbClient(ReportDao.addendumTableName)
			.insert(req)
			.returning('*')
			.get(0);
	}
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
	people: PersonPersistence[];
	vehicles: VehiclePersistence[];
	files: FilePersistence[];
	addendums: ReportAddendumPersistence[];
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

export interface CreatePersonPersistence {
	name: string | null;
	height: string | null;
	age: string | null;
	weight: string | null;
	hair_color: string | null;
	hair_length: string | null;
	eye_color: string | null;
	skin_color: string | null;
	sex: string | null;
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