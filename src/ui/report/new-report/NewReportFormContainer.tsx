import * as React from 'react';
import { observer } from 'mobx-react';
import { NewReportFormStore } from './NewReportFormStore';
import { NewReportForm } from './NewReportForm';

export const NewReportFormContainer = observer(() =>
	<NewReportForm {...NewReportFormStore.getInstance().newReportFormProps} />
);