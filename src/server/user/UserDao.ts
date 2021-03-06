import * as Knex from 'knex';
import { getDbClientInstance } from '../database/dbClient';
import { TimestampedPersistence } from '../lib/TimestampedPersistence';

export class UserDao {
	public static getInstance() {
		return this._instance || (this._instance = new UserDao());
	}

	public static tableName = 'user';
	private static _instance: UserDao;

	constructor(
		private dbClient: Knex = getDbClientInstance()
	) { }

	public async findPage(page: number, limit: number = 50): Promise<UserPersistence[]> {
		return this.dbClient(UserDao.tableName)
			.select('*')
			.orderBy('id', 'DESC')
			.offset(page * limit)
			.limit(limit);
	}

	public async findById(id: number): Promise<UserPersistence | null> {
		return this.dbClient(UserDao.tableName).where({ id }).first();
	}

	public async findByIds(ids: number[]): Promise<UserPersistence[]> {
		return this.dbClient(UserDao.tableName).whereIn('id', ids);
	}

	public async findByUsername(username: string): Promise<UserPersistence | null> {
		return this.dbClient(UserDao.tableName).where({ username: username.toLowerCase() }).first();
	}

	public async create(user: CreateUserPersistence): Promise<UserPersistence> {
		return this.dbClient(UserDao.tableName)
			.insert({
				...user,
				username: user.username.toLowerCase()
			})
			.returning('*')
			.get(0);
	}

	public async update(id: number, userUpdate: Partial<UserPersistence>): Promise<UserPersistence> {
		return this.dbClient(UserDao.tableName)
			.update({ ...userUpdate, id, updated: new Date(), created_at: undefined })
			.where({ id })
			.returning('*')
			.get(0);
	}

	public async deleteById(id: number): Promise<void> {
		return this.dbClient(UserDao.tableName)
			.where({ id })
			.del()
			.then(() => undefined);
	}
}

export enum UserRole {
	admin = 'admin',
	analyst = 'analyst',
	reporter = 'reporter'
}

export interface CreateUserPersistence {
	username: string;
	password: string;
	role: UserRole;
}

export interface UserPersistence extends CreateUserPersistence, TimestampedPersistence {
	id: number;
	is_active: boolean;
}