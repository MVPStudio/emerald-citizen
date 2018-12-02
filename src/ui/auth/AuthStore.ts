import { observable, action, computed, reaction } from 'mobx';
import { uiApiClient } from 'ui/common/uiApiClient';
import { RouterStore } from 'ui/routing/RouterStore';
import { User, LoginRequest, UserRole } from 'shared/ApiClient';

export class AuthStore {
	public static getInstance() {
		return this._instance || (this._instance = new AuthStore());
	}

	private static _instance: AuthStore;

	constructor(
		private apiClient = uiApiClient,
		private routerStore = RouterStore.getInstance()
	) { }

	@observable.ref
	public hasFetchedCurrentUser = false;

	@observable.ref
	public user: User | null;

	@computed
	public get isLoggedIn() {
		return this.hasFetchedCurrentUser && this.user != null;
	}

	@observable.ref
	public loginFailed: boolean = false;

	@observable.ref
	public loggingIn: boolean = false;

	@action.bound
	public async login(req: LoginRequest) {
		this.loginFailed = false;
		this.loggingIn = true;

		try {
			const { data: user } = await this.apiClient.auth.login(req);

			this.setUser(user);

			this.routerStore.router.navigate(user.role === UserRole.reporter ? 'newReport' : 'reportsTable')
		} catch (e) {
			this.loginFailed = true;
		}

		this.loggingIn = false;
	}

	@action.bound
	public async fetchCurrentUser(): Promise<boolean> {
		this.hasFetchedCurrentUser = true;
		const { data: user } = await this.apiClient.me.get();

		this.setUser(user);

		return user != null;
	}

	@action.bound
	public logout() {
		this.hasFetchedCurrentUser = false;
		this.routerStore.router.navigate('index');
		this.apiClient.auth.logout();
	}

	@action
	private setUser(user: User | null) {
		this.user = user;
	}
}