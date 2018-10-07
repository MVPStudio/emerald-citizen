import * as React from 'react';
import { NewReportForm } from './NewReportForm';
import { MobilePageContainer } from '../../layouts/MobilePageContainer';

const classes = require('./NewReportPage.css');

export class NewReportPage extends React.Component {
	render() {
		return (
			<MobilePageContainer className={classes.reportPage}>
				<NewReportForm />
			</MobilePageContainer>
		);
	}
}