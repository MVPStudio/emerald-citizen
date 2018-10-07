import * as React from 'react';
import { MyReportsStore } from './MyReportsStore';
import { observer } from 'mobx-react';
import { MyReportsPageComponent } from './MyReportsComponent';

export const MyReportsPage = observer(() => <MyReportsPageComponent {...MyReportsStore.getInstance().props} />);