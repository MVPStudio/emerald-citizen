import * as React from 'react';
import { RouterComponent, RouterComponentProps } from './RouterComponent';
import { routes } from './routes';
import { observer } from 'mobx-react';
import { RouterStore } from './RouterStore';
import { AuthStore } from '../auth/AuthStore';

const routerStore = RouterStore.getInstance();

export const Router = observer(() => {
	const authStore = AuthStore.getInstance();
	const props: RouterComponentProps = {
		routes,
		routeNames: routerStore.routeNames,
		fetchCurrentUser: authStore.fetchCurrentUser,
		isLoggedIn: authStore.isLoggedIn
	};

	return <RouterComponent {...props} />
});