import * as React from 'react';
import { observer } from 'mobx-react';
import { NewReportFormStore } from '../NewReportFormStore';
import { NewPersonForm } from './NewPersonForm';

export const NewPersonFormContainer = observer(() =>
	<NewPersonForm {...NewReportFormStore.getInstance().newPersonFormProps} />
);