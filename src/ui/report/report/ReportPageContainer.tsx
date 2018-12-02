import * as React from 'react';
import { MyReportsStore } from './ReportStore';
import { observer } from 'mobx-react';
import { ReportPage } from './ReportPage';

export const ReportPageContainer = observer(() => <ReportPage {...MyReportsStore.getInstance().props} />);