import * as React from 'react';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import { CreateVehicleRequest } from 'shared/ApiClient';
import { VEHICLE_MAKE_OPTIONS, getVehiclesModelsByMake, VEHICLE_COLOR_OPTIONS } from '../../common/vehicleOptions';
import { Select } from 'ui/common/components/Select';

const classes = require('./NewVehicleFormComponent.css');

export interface NewVehicleFormProps {
	vehicle: Partial<CreateVehicleRequest>
	updateVehicle: (update: Partial<CreateVehicleRequest>) => void;
	saveVehicle: () => void;
	allowSaveVehicle: boolean;
}

export class NewVehicleFormComponent extends React.Component<NewVehicleFormProps> {

	render() {
		const { allowSaveVehicle, vehicle } = this.props;
		const { make, model, color, license_plate } = vehicle;

		return (
			<form onSubmit={this.onSubmit} className={classes.personForm}>
				<h1>Add Vehicle</h1>
				<Select options={VEHICLE_MAKE_OPTIONS} value={make} onChange={this.updateMake} />
				<Select options={getVehiclesModelsByMake(make || '')} disabled={make == null || make.length === 0} value={model} onChange={this.updateField('model')} />
				<Select options={VEHICLE_COLOR_OPTIONS} value={color} onChange={this.updateField('color')} />
				<Input
					label='License Plate'
					value={license_plate}
					onChange={this.updateField('license_plate')}
				/>
				<Button type='submit' label='Save' raised={true} primary={true} disabled={!allowSaveVehicle} />
			</form>
		);
	}

	private updateMake = (make: string) => {
		this.props.updateVehicle({ make, model: null })
	}
	private updateField = (key: keyof CreateVehicleRequest) => (value: string) => this.props.updateVehicle({ [key]: value });

	private onSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		this.props.saveVehicle();
	}
}
