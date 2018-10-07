import * as React from 'react';
import { observer } from 'mobx-react';
import { NewReportFormStore } from './NewReportFormStore';
import { NewReportFormComponent } from './NewReportFormComponent';

export const NewReportForm = observer(() =>
	<NewReportFormComponent {...NewReportFormStore.getInstance().newReportFormProps} />
);