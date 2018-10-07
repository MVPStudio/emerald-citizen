import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router } from './routing/Router';
import { RouterStore } from './routing/RouterStore';
import { routes } from './routing/routes';
require('./theme/theme.css');

// mount our routes and start the router
RouterStore.getInstance().start(routes);

ReactDOM.render(
	<Router />,
	document.getElementById('root')
);
