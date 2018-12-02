import * as React from 'react'

const classes = require('./MobilePageContainer.css');

export class MobilePageContainer extends React.Component<{ className?: string }> {

	render() {
		const { children, className } = this.props;

		return (
			<div>
				<div className={`${classes.pageContainer} ${className}`}>
					{children}
				</div>
			</div>
		);
	}
}