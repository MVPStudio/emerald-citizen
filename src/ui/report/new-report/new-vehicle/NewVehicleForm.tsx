import * as React from 'react';
import { observer } from 'mobx-react';
import { NewReportFormStore } from '../NewReportFormStore';
import { NewVehicleFormComponent } from './NewVehicleFormComponent';

export const NewVehicleForm = observer(() =>
	<NewVehicleFormComponent {...NewReportFormStore.getInstance().newVehicleFormProps} />
);