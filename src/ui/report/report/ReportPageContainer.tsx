import * as React from 'react';
import { ReportStore } from './ReportStore';
import { observer } from 'mobx-react';
import { ReportPage } from './ReportPage';

export const ReportPageContainer = observer(() => <ReportPage {...ReportStore.getInstance().props} />);