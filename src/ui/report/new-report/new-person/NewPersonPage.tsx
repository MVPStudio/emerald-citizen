import * as React from 'react';
import { MobilePageContainer } from '../../../common/components/layouts/MobilePageContainer';
import { NewPersonFormContainer } from './NewPersonFormContainer';

const classes = require('./NewPersonPage.css');

export class NewPersonPage extends React.Component {
	render() {
		return (
			<MobilePageContainer className={classes.reportPage}>
				<NewPersonFormContainer />
			</MobilePageContainer>
		);
	}
}