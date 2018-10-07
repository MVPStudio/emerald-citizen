import { UserDao, UserPersistence, CreateUserPersistence } from './UserDao';
import { Omit } from '../lib/typeUtils';
import { ServiceError, ServiceErrorCode } from '../lib/ServiceError';
import { pbkdf2, randomBytes } from 'crypto';
import { promisify } from 'util';
import { LoginRequest, User } from 'shared/ApiClient';
import { handleDatabaseError } from '../lib/databaseUtils';

const pbkdf2Promisified = promisify(pbkdf2);

export class UserService {
	public static getInstance() {
		return this._instance || (this._instance = new UserService());
	}

	private static _instance: UserService;

	constructor(
		private userDao: UserDao = UserDao.getInstance()
	) { }

	public findAll(): Promise<SanitizedUser[]> {
		return this.userDao.findAll()
			.then(users => users.map(this.sanitizeUser))
			.catch(handleDatabaseError);
	}

	public findById(id: number): Promise<SanitizedUser | null> {
		return this.userDao.findById(id)
			.then(user => user ? this.sanitizeUser(user) : null)
			.catch(handleDatabaseError);
	}

	public findByUsername(username: string): Promise<SanitizedUser | null> {
		return this.userDao.findByUsername(username)
			.then(user => user ? this.sanitizeUser(user) : null)
			.catch(handleDatabaseError);
	}

	public async create(user: CreateUserPersistence): Promise<SanitizedUser> {
		return this.userDao
			.create({
				...user,
				password: await this.createPasswordForDatabase(user.password)
			})
			.catch(handleDatabaseError)
			.then(this.sanitizeUser);
	}

	public async update(id: number, userUpdate: Partial<UserPersistence>): Promise<SanitizedUser> {

		if (userUpdate.username != null) {
			const existingUser = await this.userDao.findByUsername(userUpdate.username);

			if (existingUser != null) {
				throw new ServiceError('Username is taken.', ServiceErrorCode.BAD_REQUEST)
			}
		}

		const password = userUpdate.password == null ? undefined : await this.createPasswordForDatabase(userUpdate.password);

		return this.userDao
			.update(
				id,
				{
					...userUpdate,
					password
				}
			)
			.catch(handleDatabaseError)
			.then(this.sanitizeUser);
	}

	public async login({ username, password }: LoginRequest): Promise<SanitizedUser> {
		const user = await this.userDao.findByUsername(username).catch(handleDatabaseError);

		if (user == null || !user.is_active) {
			return this.loginFailure();
		}

		const verified = await this.verifyPassword(password, user.password);

		if (!verified) {
			return this.loginFailure();
		}

		return this.sanitizeUser(user);
	}

	private async createPasswordForDatabase(password: string) {
		const passwordObjectWithoutHash = {
			cipher: 'sha512',
			iterations: 300000,
			length: 64,
			salt: (await randomBytes(16)).toString('hex')
		};
		const passwordObject: PasswordObject = {
			...passwordObjectWithoutHash,
			hash: await this.createPasswordHash(password, passwordObjectWithoutHash)
		};

		return JSON.stringify(passwordObject);
	}

	private async createPasswordHash(password: string, { salt, iterations, length, cipher }: Omit<PasswordObject, 'hash'>) {
		return (await pbkdf2Promisified(password, salt, iterations, length, cipher)).toString('hex');
	}

	private async verifyPassword(password: string, stringifiedPasswordObject: string) {
		const passwordObject = JSON.parse(stringifiedPasswordObject) as PasswordObject;

		return passwordObject.hash === (await this.createPasswordHash(password, passwordObject));
	}

	private sanitizeUser = (user: UserPersistence) => ({ ...user, password: undefined });

	private loginFailure(): never {
		throw new ServiceError('Login failed.', ServiceErrorCode.AUTHENTICATION_ERROR);
	}
}

interface PasswordObject {
	cipher: string,
	iterations: number,
	length: number,
	salt: string | Buffer,
	hash: string | Buffer
}

// make sure we don't return the password, or any other sensitive fields
export type SanitizedUser = Omit<UserPersistence, 'password'> & { password: undefined };