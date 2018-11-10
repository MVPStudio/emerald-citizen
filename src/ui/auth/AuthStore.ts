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
	) {
		reaction(
			() => {
				const onAuthPage = this.routerStore.componentRoute != null && this.routerStore.componentRoute.auth;

				return onAuthPage && !this.isLoggedIn && this.hasFetchedCurrentUser;
			},
			(redirect: boolean) => {
				if (redirect) {
					// HACK: router5 seems to need the current observable chain to finish before it can update the url again
					setTimeout(() => this.routerStore.router.navigate('login'));
				}
			},
			{
				fireImmediately: true
			}
		);
	}

	@observable.ref
	private hasFetchedCurrentUser = false;

	@observable.ref
	public user: User | null;

	@computed
	public get isLoggedIn() {
		return this.hasFetchedCurrentUser && this.user != null;
	}

	@observable.ref
	public loginFailed: boolean = false;

	@action.bound
	public async login(req: LoginRequest) {
		this.loginFailed = false;

		try {
			const { data: user } = await this.apiClient.auth.login(req);

			this.setUser(user);

			this.routerStore.router.navigate(user.role === UserRole.reporter ? 'newReport' : 'reportsMap')
		} catch (e) {
			this.loginFailed = true;
		}
	}

	@action.bound
	public async fetchCurrentUser() {
		const { data: user } = await this.apiClient.me.get();

		this.setUser(user);
	}

	public readonly logout = async () => {
		await this.apiClient.auth.logout();
		this.user = null;
	}

	@action
	private setUser(user: User | null) {
		this.user = user;
		this.hasFetchedCurrentUser = true;
	}
}