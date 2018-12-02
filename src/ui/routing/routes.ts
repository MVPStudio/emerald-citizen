import { NotFoundPage } from '../errors/NotFoundPage';
import { constants, Route } from 'router5';
import { ComponentType } from 'react';
import { NewReportPage } from '../report/new-report/NewReportPage';
import { NewPersonPage } from '../report/new-report/new-person/NewPersonPage';
import { NewVehiclePage } from '../report/new-report/new-vehicle/NewVehiclePage';
import { LoginPage } from '../auth/LoginPage';
import { MyReportsPage } from '../report/my-reports/MyReportsPage';
import { ReportPageContainer } from '../report/report/ReportPageContainer';
import { NewReportSucceessPage } from '../report/new-report-sucess/NewReportSuccessPage';
import { ReportsTablePageContainer } from '../report/reports-table/ReportsTablePageContainer';
import { ReportsMapPage } from '../report/reports-map/ReportsMapPage';
import { IndexPage } from '../static_pages/IndexPage';
import { AuthStore } from 'ui/auth/AuthStore';

const redirectOnLoggedOut = (loggedIn: boolean) => loggedIn ? Promise.resolve(true) : Promise.reject({ redirect: { name: 'login' } })
const mustBeLoggedIn = () => () => {
	const authStore = AuthStore.getInstance();

	if (authStore.hasFetchedCurrentUser) {
		return redirectOnLoggedOut(authStore.isLoggedIn);
	}

	return authStore.fetchCurrentUser().then(redirectOnLoggedOut);
};

/**
 * Configuration of routes to components.
 */
export const routes: ComponentRoute[] = [
	{
		name: 'index',
		path: '/',
		component: IndexPage
	},
	{
		name: 'login',
		path: '/login',
		component: LoginPage
	},
	{
		name: 'newReport',
		path: '/new-report',
		component: NewReportPage,
		canActivate: mustBeLoggedIn
	},
	{
		name: 'newReportSuccess',
		path: '/new-report/success',
		component: NewReportSucceessPage,
		canActivate: mustBeLoggedIn
	},
	{
		name: 'newPerson',
		path: '/new-report/person/:id',
		component: NewPersonPage,
		canActivate: mustBeLoggedIn
	},
	{
		name: 'newVehicle',
		path: '/new-report/vehicle/:id',
		component: NewVehiclePage,
		canActivate: mustBeLoggedIn
	},
	{
		name: 'myReports',
		path: '/me/reports',
		component: MyReportsPage,
		canActivate: mustBeLoggedIn
	},
	{
		name: 'report',
		path: '/report/:id',
		component: ReportPageContainer,
		canActivate: mustBeLoggedIn
	},
	{
		name: 'reportsTable',
		path: '/reports/table',
		component: ReportsTablePageContainer,
		canActivate: mustBeLoggedIn
	},
	{
		name: 'reportsMap',
		path: '/reports/map',
		component: ReportsMapPage,
		canActivate: mustBeLoggedIn
	},
	{
		name: constants.UNKNOWN_ROUTE,
		path: '/not-found',
		component: NotFoundPage
	}
];

export interface ComponentRoute extends Route {
	component: ComponentType<{}>;
	children?: ComponentRoute[];
}