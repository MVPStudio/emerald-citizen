import { observable, action, computed } from 'mobx';
import { uiApiClient } from 'ui/common/uiApiClient';
import { Report, UserRole } from 'shared/ApiClient';
import { RouterStore } from '../../routing/RouterStore';
import { ReportPageComponentProps } from './ReportPageComponent';
import { AuthStore } from '../../auth/AuthStore';

export class MyReportsStore {

	public static getInstance() {
		return this._instance || (this._instance = new MyReportsStore());
	}

	private static _instance: MyReportsStore;

	constructor(
		private apiClient = uiApiClient,
		private routerStore = RouterStore.getInstance(),
		private authStore = AuthStore.getInstance()
	) { }

	@observable.ref
	private report: Report | null = null;

	@observable.ref
	private fetching = true;

	@observable.ref
	private canAddAddendum = false;

	@observable.ref
	private canMarkNotable = false

	@action.bound
	private async fetchReport() {
		const id = this.routerStore.route && this.routerStore.route.params.id;
		this.fetching = true;

		if (id) {
			const { data } = await this.apiClient.reports.findById(id);
			this.report = data;

			if (this.authStore.user != null && this.report != null) {
				this.canAddAddendum = this.authStore.user.id === this.report.user_id;
				this.canMarkNotable = this.authStore.user.role === UserRole.admin;
			}
		}

		this.fetching = false;
	}

	@action.bound
	private async saveAddendum(text: string) {
		if (this.report != null && text.length > 0) {
			await this.apiClient.reports.addAddendum(this.report.id, text);
			await this.fetchReport();
		}
	}

	@computed
	public get props(): ReportPageComponentProps {
		return {
			report: this.report,
			fetching: this.fetching,
			fetchReport: this.fetchReport,
			canAddAddendum: this.canAddAddendum,
			saveAddendum: this.saveAddendum,
			canMarkNotable: this.canMarkNotable
		}
	}
}