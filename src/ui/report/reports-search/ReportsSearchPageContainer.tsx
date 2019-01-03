import * as React from 'react';
import { ReportsSearchPageStore } from './ReportsSearchPageStore';
import { observer } from 'mobx-react';
import { ReportsSearchPage } from './ReportsSearchPage';

export const ReportsSearchPageContainer = observer(() =>
	<ReportsSearchPage {...ReportsSearchPageStore.getInstance().props} />
);