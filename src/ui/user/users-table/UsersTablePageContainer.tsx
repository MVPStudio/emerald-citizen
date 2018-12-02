import * as React from 'react';
import { UsersTableStore } from './UsersTableStore';
import { observer } from 'mobx-react';
import { UsersTable } from './UsersTablePage';

export const UserTablePageContainer = observer(() => <UsersTable {...UsersTableStore.getInstance().props} />);