import * as React from 'react';
import { observer } from 'mobx-react';
import { NewReportFormStore } from '../NewReportFormStore';
import { NewVehicleForm } from './NewVehicleForm';

export const NewVehicleFormContainer = observer(() =>
	<NewVehicleForm {...NewReportFormStore.getInstance().newVehicleFormProps} />
);