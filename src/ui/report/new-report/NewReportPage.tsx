import * as React from 'react';
import { NewReportFormContainer } from './NewReportFormContainer';
import { MobilePageContainer } from '../../layouts/MobilePageContainer';

const classes = require('./NewReportPage.css');

export class NewReportPage extends React.Component {
	render() {
		return (
			<MobilePageContainer className={classes.reportPage}>
				<NewReportFormContainer />
			</MobilePageContainer>
		);
	}
}