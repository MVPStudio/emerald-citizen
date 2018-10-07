import * as React from 'react';
import { MobilePageContainer } from '../../../layouts/MobilePageContainer';
import { NewVehicleForm } from './NewVehicleForm';

const classes = require('./NewVehiclePage.css');

export class NewVehiclePage extends React.Component {
	render() {
		return (
			<MobilePageContainer className={classes.reportPage}>
				<NewVehicleForm />
			</MobilePageContainer>
		);
	}
}