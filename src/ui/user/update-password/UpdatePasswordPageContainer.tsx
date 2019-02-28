import * as React from 'react';
import { UpdatePasswordStore } from './UpdatePasswordStore';
import { observer } from 'mobx-react';
import { UpdatePasswordPage } from './UpatePasswordPage';

export const UpdatePasswordPageContainer = observer(() => <UpdatePasswordPage {...UpdatePasswordStore.getInstance().props} />);

export const MeUpdatePasswordPageContainer = observer(() => <UpdatePasswordPage {...UpdatePasswordStore.getInstance().propsForCurrentUserUpdatePassword} />);