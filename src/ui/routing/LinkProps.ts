import { Params } from 'router5';
import { Options } from 'router5/core/navigation';

export interface LinkProps {
	routeName: string;
	routeParams?: Params;
	routeOptions?: Options;
	className?: string;
}
