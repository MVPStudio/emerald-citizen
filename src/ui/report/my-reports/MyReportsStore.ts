import { observable, action, computed } from 'mobx';
import { uiApiClient } from 'ui/common/uiApiClient';
import { ReportDetails } from 'shared/ApiClient';
import { MyReportsPageComponentProps } from './MyReportsComponent';
import { RouterStore } from '../../routing/RouterStore';

export class MyReportsStore {

	public static getInstance() {
		return this._instance || (this._instance = new MyReportsStore());
	}

	private static _instance: MyReportsStore;

	constructor(
		private apiClient = uiApiClient,
		private routerStore = RouterStore.getInstance()
	) { }

	@observable.ref
	private myReports: ReportDetails[] = [];

	@action.bound
	private async fetchMyReports() {
		const { data } = await this.apiClient.me.reports();
		this.myReports = data;
	}

	@action.bound
	private async goToReportPage(id: number) {
		this.routerStore.router.navigate('report', { id });
	}

	@computed
	public get props(): MyReportsPageComponentProps {
		return {
			myReports: this.myReports,
			fetchMyReports: this.fetchMyReports,
			goToReportPage: this.goToReportPage
		}
	}
}