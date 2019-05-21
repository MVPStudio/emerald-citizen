import * as React from 'react';
import { observer } from 'mobx-react';
import { ReportAddendumPage } from './ReportAddendumPage';
import { ReportAddendumStore } from './ReportAddendumStore';

export const ReportAddendumPageContainer = observer(() =>
	<ReportAddendumPage {...ReportAddendumStore.getInstance().props.get()} />
);
