import * as React from 'react';
import { ComponentRoute } from './routes';

export interface RouterComponentProps {
	routeNames: string[];
	routes: ComponentRoute[];
}

export class RouterComponent extends React.Component<RouterComponentProps, {}> {
	render() {
		const { routeNames, routes } = this.props;

		return this.routesToComponents(routeNames, routes);
	}

	/**
	 * Use the route names to look up and return the appropriate Component tree in the route configuration.
	 *
	 * @param routeNames
	 * @param children
	 * @return Component
	 */
	routesToComponents(routeNames: string[], children?: ComponentRoute[]): JSX.Element | null {
		if (children == null || routeNames.length === 0) {
			return null;
		}

		const currentRouteName = routeNames[0];
		const route = children.find(childRoute => childRoute.name === currentRouteName);

		if (route == null) {
			return <strong>{`Could not find matching components for route ${routeNames} at ${currentRouteName}`}</strong>;
		}

		const Component = route.component;
		const nextRouteNames = routeNames.slice(1);

		return nextRouteNames.length === 0
			? <Component />
			: <Component>{this.routesToComponents(nextRouteNames, route.children)}</Component>;
	}
}
