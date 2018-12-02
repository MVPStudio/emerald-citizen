import * as React from 'react';
import { observer } from 'mobx-react';
import { NewUserPageStoreStore } from './NewUserPageStoreStore';
import { NewUserPage } from './NewUserPage';

export const NewUserPageContainer = observer(() =>
	<NewUserPage {...NewUserPageStoreStore.getInstance().newUserPageProps} />
);