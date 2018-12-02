import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { NavBar } from './common/components/layouts/NavBar';
import { Router } from './routing/Router';
import { RouterStore } from './routing/RouterStore';
import { routes } from './routing/routes';
import { uiApiClient } from './common/uiApiClient';
require('./theme.css');

// mount our routes and start the router
RouterStore.getInstance().start(routes);

// @ts-ignore
window.apiClient = uiApiClient;

ReactDOM.render(
	<div>
		<NavBar />
		<Router />
	</div>,
	document.getElementById('root')
);
