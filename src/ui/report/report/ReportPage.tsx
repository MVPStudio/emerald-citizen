import * as React from 'react';
import { MyReportsStore } from './ReportStore';
import { observer } from 'mobx-react';
import { ReportPageComponent } from './ReportPageComponent';

export const ReportPage = observer(() => <ReportPageComponent {...MyReportsStore.getInstance().props} />);