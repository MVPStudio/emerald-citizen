import { observable, action, computed, reaction, observe } from 'mobx';
import { uiApiClient } from 'ui/common/uiApiClient';
import { User } from 'shared/ApiClient';
import { RouterStore } from '../../routing/RouterStore';
import { UsersTableProps } from './UsersTablePage';

export class UsersTableStore {

	public static getInstance() {
		return this._instance || (this._instance = new UsersTableStore());
	}

	private static _instance: UsersTableStore;

	constructor(
		private apiClient = uiApiClient,
		private routerStore = RouterStore.getInstance()
	) { }

	@observable.ref
	private users: User[] = [];

	@computed get page(): number {
		const { route } = this.routerStore;

		if (route) {
			const { params: { page } } = route;

			if (page) {
				return parseInt(page, 10);
			}
		}

		return 0;
	}

	@action.bound
	private async fetchUsers() {
		const { data } = await this.apiClient.users.findPage(this.page);
		this.users = data;
	}

	@action.bound
	private async deactivateUser(id: number) {
		const confirmed = window.confirm('Are you sure you want to deactivate this user?');

		if (confirmed) {
			await this.apiClient.users.update({ id, is_active: false });
			await this.fetchUsers();
		}
	}

	@action.bound
	private async activateUser(id: number) {
		const confirmed = window.confirm('Are you sure you want to re-activate this user?');

		if (confirmed) {
			await this.apiClient.users.update({ id, is_active: true });
			await this.fetchUsers();
		}
	}

	@computed
	public get props(): UsersTableProps {
		return {
			page: this.page,
			nextPage: this.users.length ? this.page + 1 : undefined,
			prevPage: this.page > 2 ? this.page - 1 : undefined,
			showNextPage: this.users.length === 50,
			showPrevPage: this.page > 0,
			users: this.users,
			fetchUsers: this.fetchUsers,
			deactivateUser: this.deactivateUser,
			activateUser: this.activateUser
		}
	}
}