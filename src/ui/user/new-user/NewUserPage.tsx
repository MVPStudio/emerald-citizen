import * as React from 'react';
import { MobilePageContainer } from '../../common/components/layouts/MobilePageContainer';
import { CreateUserRequest, UserRole } from 'shared/ApiClient';
import Card from 'react-toolbox/lib/card';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import Dropdown from 'react-toolbox/lib/dropdown';

const classes = require('./NewUserPage.css');

export interface NewUserPageProps {
	user: Partial<CreateUserRequest>;
	disabled: boolean;
	updateUser: (u: Partial<CreateUserRequest>) => void;
	submit: VoidFunction;
}

export class NewUserPage extends React.Component<NewUserPageProps> {
	render() {
		const { user, disabled } = this.props;
		const { username, password, role } = user;

		return (
			<MobilePageContainer>
				<Card className={classes.newUserPage}>
					<h1>New User</h1>
					<form onSubmit={this.onSubmit}>
						<Input
							// @ts-ignore: autoFocus missing on type def
							autoFocus={true}
							label='Username'
							hint='Must be at least 5 characters long'
							value={username}
							onChange={this.updateFieldHandler('username')}
						/>
						<Input
							label='Password'
							hint='Must be at least 5 characters long'
							value={password}
							onChange={this.updateFieldHandler('password')}
						/>
						<Dropdown
							label='Role'
							auto={false}
							source={this.userRoleOptions}
							value={role}
							onChange={this.updateFieldHandler('role')}
						/>
						<Button type='submit' disabled={disabled} primary={true} raised={true}>Submit</Button>
					</form>
				</Card>
			</MobilePageContainer>
		);
	}

	private userRoleOptions = Object.values(UserRole).map(value => ({ label: value, value }));

	private updateFieldHandler = (name: string) => (value: string) => {
		this.props.updateUser({ [name]: value });
	}

	private onSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		this.props.submit();
	}
}