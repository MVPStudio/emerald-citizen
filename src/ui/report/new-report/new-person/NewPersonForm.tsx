import * as React from 'react';
import { observer } from 'mobx-react';
import { NewReportFormStore } from '../NewReportFormStore';
import { NewPersonFormComponent } from './NewPersonFormComponent';

export const NewPersonForm = observer(() =>
	<NewPersonFormComponent {...NewReportFormStore.getInstance().newPersonFormProps} />
);