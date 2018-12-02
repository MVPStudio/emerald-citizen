import { UserService, SanitizedUser } from '../user/UserService';
import { LoginRequest } from 'shared/ApiClient';
import { ServiceError, ServiceErrorCode } from '../lib/ServiceError';

export class AuthService {
	public static getInstance(): AuthService {
		return this._instance || (this._instance = new AuthService)
	}

	private static _instance: AuthService;

	constructor(
		private userService = UserService.getInstance()
	) { }

	public async login(session: Express.Session, { username, password }: LoginRequest): Promise<SanitizedUser> {
		session.user = await this.userService.login({ username, password });

		await new Promise((resolve, reject) => {
			session.save(err => {
				if (err) {
					reject(this.sessionError());
					return;
				}

				resolve();
			});
		});

		return session.user;
	}

	public async logout(session: Express.Session): Promise<void> {
		await new Promise((resolve, reject) => {
			session.destroy(err => {
				if (err) {
					reject(this.sessionError());
					return;
				}

				resolve();
			});
		});
	}

	private sessionError = () => new ServiceError('Error saving session data.', ServiceErrorCode.SERVER_ERROR);
}