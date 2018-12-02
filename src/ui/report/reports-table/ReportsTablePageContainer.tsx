import * as React from 'react';
import { ReportsTableStore } from './ReportsTableStore';
import { observer } from 'mobx-react';
import { ReportsTable } from './ReportsTablePage';

export const ReportsTablePageContainer = observer(() => <ReportsTable {...ReportsTableStore.getInstance().props} />);