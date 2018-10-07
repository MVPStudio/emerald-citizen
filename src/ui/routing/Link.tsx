import * as React from 'react';
import { LinkComponent } from './LinkComponent';
import { LinkProps } from './LinkProps';
import { observer } from 'mobx-react';
import { RouterStore } from './RouterStore';

const routerStore = RouterStore.getInstance();

export const Link = observer(class extends React.Component<LinkProps, {}> {
	render() {
		return <LinkComponent {...this.props} router={routerStore.router} />;
	}
});
