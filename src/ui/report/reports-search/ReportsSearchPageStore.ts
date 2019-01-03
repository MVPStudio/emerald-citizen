import { observable, action, computed } from 'mobx';
import { uiApiClient } from 'ui/common/uiApiClient';
import { Report, SearchReportsRequest } from 'shared/ApiClient';
import { ReportsSearchPageProps } from './ReportsSearchPage';

export class ReportsSearchPageStore {
	public static getInstance() {
		return this._instance || (this._instance = new ReportsSearchPageStore());
	}

	private static _instance: ReportsSearchPageStore;

	constructor(
		private apiClient = uiApiClient
	) { }

	@observable.ref
	public searching = false;

	@observable.ref
	public reports: Report[] = [];

	@observable.ref
	public searchParams: SearchReportsRequest = {};

	@action.bound
	public async search() {
		this.searching = true;

		try {
			const { data } = await this.apiClient.reports.search({ ...this.searchParams });

			this.setReports(data);
		} catch (e) {
			console.error(e); // tslint:disable-line no-console
			this.setReports([]);
		}
	}

	@action
	private setReports(reports: Report[]) {
		this.reports = reports;
		this.searching = false;
	}

	@action.bound
	private onLocationChange(value: string) {
		this.setSearchParam('location', value);
	}

	@action.bound
	private onDetailsChange(value: string) {
		this.setSearchParam('details', value);
	}

	private setSearchParam(key: string, value: any) {
		this.searchParams = { ...this.searchParams, [key]: value };
	}

	@action.bound
	private reset() {
		this.searchParams = {};
		this.searching = false;
	}

	@computed
	public get props(): ReportsSearchPageProps {
		return {
			reset: this.reset,
			search: this.search,
			searching: this.searching,
			searchParams: this.searchParams,
			reports: this.reports,
			onLocationChange: this.onLocationChange,
			onDetailsChange: this.onDetailsChange
		};
	}
}