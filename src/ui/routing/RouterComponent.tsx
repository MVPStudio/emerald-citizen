import * as React from 'react';
import { ComponentRoutes } from './routes';

export interface RouterComponentProps {
	routeNames: string[];
	routes: ComponentRoutes;
	fetchCurrentUser: () => void;
	isLoggedIn: boolean;
}

export class RouterComponent extends React.Component<RouterComponentProps, {}> {
	componentDidMount() {
		this.props.fetchCurrentUser();
	}

	render() {
		const { routeNames, routes } = this.props;

		return this.routesToComponents(routeNames, routes);
	}

	/**
	 * Use the route names to look up and return the appropriate Component tree in the route configuration.
	 *
	 * @param routeNames
	 * @param nestedRoute
	 * @return Component
	 */
	routesToComponents(routeNames: string[], nestedRoute?: ComponentRoutes): JSX.Element | null {
		if (nestedRoute == null || routeNames.length === 0) {
			return null;
		}

		const route = nestedRoute[routeNames[0]];
		const Component = route.component;
		const { isLoggedIn } = this.props;
		const hideUntilAuthenticated = route.auth && !isLoggedIn;

		if (hideUntilAuthenticated) {
			return null;
		}

		if (routeNames.length === 1) {
			return <Component />;
		}

		return <Component>{this.routesToComponents(routeNames.slice(1), route.children)}</Component>;
	}
}
