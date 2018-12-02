import { observable, action, computed } from 'mobx';
import { uiApiClient } from 'ui/common/uiApiClient';
import { CreateUserRequest, UserRole } from 'shared/ApiClient';
import { RouterStore } from 'ui/routing/RouterStore';
import { NewUserPageProps } from './NewUserPage';

export class NewUserPageStoreStore {

	public static getInstance() {
		return this._instance || (this._instance = new NewUserPageStoreStore());
	}

	private static _instance: NewUserPageStoreStore;

	constructor(
		private apiClient = uiApiClient,
		private routerStore = RouterStore.getInstance()
	) { }

	@observable.ref
	private submitting = false;

	@computed
	private get disabled() {
		return this.submitting;
	}

	@observable.ref
	private user: Partial<CreateUserRequest> = this.emptyUser();

	@action.bound
	private updateUser(update: Partial<CreateUserRequest>) {
		this.user = { ...this.user, ...update };
	}

	@action.bound
	private doneSubmitting() {
		this.user = this.emptyUser();
		this.submitting = false;
	}

	private emptyUser() {
		return {
			username: '',
			password: '',
			role: UserRole.reporter
		}
	}

	@action.bound
	private async submit() {
		this.submitting = true;
		await this.apiClient.users.create(this.user as CreateUserRequest);

		this.doneSubmitting();
		this.routerStore.router.navigate('usersTable')
	}

	@computed
	public get newUserPageProps(): NewUserPageProps {
		return {
			user: this.user,
			disabled: this.disabled,
			updateUser: this.updateUser,
			submit: this.submit
		};
	}

}