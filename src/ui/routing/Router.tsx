import * as React from 'react';
import { RouterComponent, RouterComponentProps } from './RouterComponent';
import { routes } from './routes';
import { observer } from 'mobx-react';
import { RouterStore } from './RouterStore';

const routerStore = RouterStore.getInstance();

export const Router = observer(() => {
	const props: RouterComponentProps = {
		routes,
		routeNames: routerStore.routeNames
	};

	return <RouterComponent {...props} />
});