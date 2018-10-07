import listenersPlugin from 'router5/plugins/listeners';
import browserPlugin from 'router5/plugins/browser';
import { observable, action, computed } from 'mobx';
import { createRouter, Router, State, Route } from 'router5';
import { ComponentRoutes, ComponentRoute } from './routes';

export class RouterStore {
	public static getInstance() {
		return this._instance || (this._instance = new RouterStore())
	}

	private static _instance: RouterStore;
	private componentRoutes: ComponentRoutes;

	constructor(
		readonly router: Router = createRouter([], { allowNotFound: true, queryParamsMode: 'loose' })
			.usePlugin(browserPlugin())
			.usePlugin(listenersPlugin())
	) { }

	public start(routes: ComponentRoutes): this {
		this.componentRoutes = routes;
		this.router
			.add(this.componentRoutesToRoutes(this.componentRoutes))
			.start()
			.subscribe(this.updateRoute);

		this.updateRoute({ route: this.router.getState() });

		return this;
	}

	@observable.ref
	public route?: State;

	@observable.ref
	public previousRoute?: State;

	@observable.ref
	public componentRoute?: ComponentRoute;

	@computed
	public get routeNames(): string[] {
		return this.route ? this.route.name.split('.') : [];
	}

	@action
	private updateRoute = ({ previousRoute, route }: { previousRoute?: State, route: State }) => {
		this.route = route;
		this.previousRoute = previousRoute;
		this.componentRoute = this.componentRoutes[route.name];
	}

	// convert our custom route config to router 5 routes
	private componentRoutesToRoutes(componentRoute?: ComponentRoutes): Route[] {
		if (componentRoute == null) {
			return [];
		}

		return Object.keys(componentRoute).reduce(
			(flattenedRoutes: Route[], name: string) => {
				const route = componentRoute[name];
				const children = this.componentRoutesToRoutes(route.children);

				flattenedRoutes.push({ name, path: route.path, children });

				return flattenedRoutes;
			},
			[]
		);
	}
}