import { observable, action, computed } from 'mobx';
import { uiApiClient } from 'ui/common/uiApiClient';
import { User } from 'shared/ApiClient';
import { RouterStore } from '../../routing/RouterStore';
import { UpdatePasswordPageProps } from './UpatePasswordPage';

export class UpdatePasswordStore {

	public static getInstance() {
		return this._instance || (this._instance = new UpdatePasswordStore());
	}

	private static _instance: UpdatePasswordStore;

	constructor(
		private apiClient = uiApiClient,
		private routerStore = RouterStore.getInstance()
	) { }

	@observable.ref
	private user: User | null = null;

	@observable.ref
	private password: string = '';

	@observable.ref
	private fetching = true;

	@computed
	private get disabled() {
		return this.password.length < 5;
	}

	@observable.ref
	private success = false;

	@observable.ref
	private error = false;

	@action.bound
	public async fetchUser() {
		const id = this.routerStore.route && this.routerStore.route.params.id;
		this.fetching = this.user == null; // only set fetching once
		this.resetPassword();

		if (id) {
			const { data } = await this.apiClient.users.findById(id);
			this.user = data;
		}

		this.fetching = false;
	}

	@action.bound
	public updatePassword(pw: string) {
		this.password = pw;
	}

	@action.bound
	public async submit() {
		if (this.user) {
			await this.apiClient.users.update({ id: this.user.id, password: this.password });
			this.resetPassword();
			this.routerStore.router.navigate('usersTable')
		}
	}

	@action
	private resetPassword() {
		this.password = ''
	}

	@computed
	public get props(): UpdatePasswordPageProps {
		return {
			user: this.user,
			password: this.password,
			fetching: this.fetching,
			disabled: this.disabled,
			fetchUser: this.fetchUser,
			updatePassword: this.updatePassword,
			submit: this.submit
		}
	}
}