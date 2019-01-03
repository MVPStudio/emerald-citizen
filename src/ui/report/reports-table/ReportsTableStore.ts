import { observable, action, computed } from 'mobx';
import { uiApiClient } from 'ui/common/uiApiClient';
import { Report } from 'shared/ApiClient';
import { ReportsTablePageProps } from './ReportsTablePage';
import { RouterStore } from '../../routing/RouterStore';

export class ReportsTableStore {

	public static getInstance() {
		return this._instance || (this._instance = new ReportsTableStore());
	}

	private static _instance: ReportsTableStore;

	constructor(
		private apiClient = uiApiClient,
		private routerStore = RouterStore.getInstance()
	) { }

	@observable.ref
	private reports: Report[] = [];

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
	private async fetchReports() {
		const { data } = await this.apiClient.reports.findSortedPage(this.page);
		this.reports = data;
	}

	@action.bound
	private async goToReportPage(id: number) {
		this.routerStore.router.navigate('report', { id });
	}

	@computed
	public get props(): ReportsTablePageProps {
		return {
			page: this.page,
			nextPage: this.reports.length ? this.page + 1 : undefined,
			prevPage: this.page > 2 ? this.page - 1 : undefined,
			showNextPage: this.reports.length === 50,
			showPrevPage: this.page > 0,
			reports: this.reports,
			fetchReports: this.fetchReports,
			goToReportPage: this.goToReportPage
		}
	}
}