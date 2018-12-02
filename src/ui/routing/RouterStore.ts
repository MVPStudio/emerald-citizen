import listenersPlugin from 'router5/plugins/listeners';
import browserPlugin from 'router5/plugins/browser';
import { observable, action, computed } from 'mobx';
import { createRouter, Router, State } from 'router5';
import { ComponentRoute } from './routes';

export class RouterStore {
	public static getInstance() {
		return this._instance || (this._instance = new RouterStore())
	}

	private static _instance: RouterStore;
	private componentRoutes: ComponentRoute[];

	constructor(
		readonly router: Router = createRouter([], { allowNotFound: true, queryParamsMode: 'loose' })
			.usePlugin(browserPlugin())
			.usePlugin(listenersPlugin())
	) { }

	public start(routes: ComponentRoute[]): this {
		this.componentRoutes = routes;
		this.router
			.add(this.componentRoutes)
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
		this.componentRoute = route ? this.componentRoutes.find(cr => cr.name === route.name) : undefined;
	}
}