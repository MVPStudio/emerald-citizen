import { observable, action, computed } from 'mobx';
import { uiApiClient } from 'ui/common/uiApiClient';
import { ReportDetails, UserRole } from 'shared/ApiClient';
import { RouterStore } from '../../routing/RouterStore';
import { ReportPageProps } from './ReportPage';
import { AuthStore } from '../../auth/AuthStore';
import { UploadFilesStore } from '../common/UploadFilesStore';

export class ReportStore {

	public static getInstance() {
		return this._instance || (this._instance = new ReportStore());
	}

	private static _instance: ReportStore;

	constructor(
		private apiClient = uiApiClient,
		private routerStore = RouterStore.getInstance(),
		private authStore = AuthStore.getInstance()
	) { }

	@observable.ref
	private report: ReportDetails | null = null;

	@observable.ref
	private fetching = true;

	@observable.ref
	private disabled = true;

	@observable.ref
	private canAddAddendum = false;

	@computed
	private get isAnalyst() {
		return this.authStore.user && this.authStore.user.role === UserRole.analyst || false;
	}

	@action.bound
	public async fetchReport() {
		const id = this.routerStore.route && this.routerStore.route.params.id;
		this.fetching = this.report == null; // only set fetching once

		if (id) {
			const { data } = await this.apiClient.reports.findById(id);
			this.report = data;

			if (this.authStore.user != null && this.report != null) {
				this.canAddAddendum = this.authStore.user.id === this.report.user_id;
			}
		}

		this.fetching = false;
		this.disabled = false;
	}

	@action.bound
	public async toggleInteresting() {
		if (this.report != null) {
			this.disabled = true;
			await this.apiClient.reports.toggleInteresting(this.report.id);
			await this.fetchReport();
		}
	}

	@action.bound
	public async toggleValidated() {
		if (this.report != null) {
			this.disabled = true;
			await this.apiClient.reports.toggleValidated(this.report.id);
			await this.fetchReport();
		}
	}

	@computed
	public get props(): ReportPageProps {
		return {
			report: this.report,
			fetching: this.fetching,
			disabled: this.disabled,
			fetchReport: this.fetchReport,
			canAddAddendum: this.canAddAddendum,
			isAnalyst: this.isAnalyst,
			toggleInteresting: this.toggleInteresting,
			toggleValidated: this.toggleValidated
		}
	}
}
