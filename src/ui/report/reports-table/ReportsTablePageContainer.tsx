import * as React from 'react';
import { ReportsTableStore } from './ReportsTableStore';
import { observer } from 'mobx-react';
import { ReportsTablePage } from './ReportsTablePage';

export const ReportsTablePageContainer = observer(() => <ReportsTablePage {...ReportsTableStore.getInstance().props} />);