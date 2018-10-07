import { NotFoundPage } from '../errors/NotFoundPage';
import { constants } from 'router5';
import { ComponentType } from 'react';
import { NewReportPage } from '../report/new-report/NewReportPage';
import { NewPersonPage } from '../report/new-report/new-person/NewPersonPage';
import { NewVehiclePage } from '../report/new-report/new-vehicle/NewVehiclePage';
import { LoginPage } from '../auth/LoginPage';
import { MyReportsPage } from '../report/my-reports/MyReportsPage';
import { ReportPage } from '../report/report/ReportPage';
import { NewReportSucceessPage } from '../report/new-report-sucess/NewReportSuccessPage';
import { ReportsTablePage } from '../report/reports-table/ReportsTablePage';
import { ReportsMapPage } from '../report/reports-map/ReportsMapPage';
import { IndexPage } from '../static_pages/IndexPage';

/**
 * Configuration of routes to components
 */
export const routes: ComponentRoutes = {
	index: {
		path: '/',
		component: IndexPage
	},
	login: {
		path: '/login',
		component: LoginPage
	},
	newReport: {
		path: '/new-report',
		component: NewReportPage,
		auth: true
	},
	newReportSuccess: {
		path: '/new-report/success',
		component: NewReportSucceessPage,
		auth: true
	},
	newPerson: {
		path: '/new-report/person/:id',
		component: NewPersonPage,
		auth: true
	},
	newVehicle: {
		path: '/new-report/vehicle/:id',
		component: NewVehiclePage,
		auth: true
	},
	myReports: {
		path: '/me/reports',
		component: MyReportsPage,
		auth: true
	},
	report: {
		path: '/report/:id',
		component: ReportPage,
		auth: true
	},
	reportsTable: {
		path: '/reports/table',
		component: ReportsTablePage,
		auth: true
	},
	reportsMap: {
		path: '/reports/map',
		component: ReportsMapPage,
		auth: true
	},
	[constants.UNKNOWN_ROUTE]: {
		path: '/not-found',
		component: NotFoundPage
	}
};

export interface ComponentRoute {
	path: string;
	component: ComponentType<{}>;
	children?: ComponentRoutes;
	params?: object;
	auth?: boolean;
}

export interface ComponentRoutes {
	[name: string]: ComponentRoute;
}