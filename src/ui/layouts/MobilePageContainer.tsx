import * as React from 'react'
import { NavBar } from './NavBar';

const classes = require('./MobilePageContainer.css');

export class MobilePageContainer extends React.Component<{ className?: string }> {

	render() {
		const { children, className } = this.props;

		return (
			<div>
				<NavBar />
				<div className={`${classes.pageContainer} ${className}`}>
					{children}
				</div>
			</div>
		);
	}
}