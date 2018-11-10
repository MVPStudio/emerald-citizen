import * as React from 'react';
import { LoginRequest } from 'shared/ApiClient';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import { observer } from 'mobx-react';
import { AuthStore } from './AuthStore';

const classes = require('./LoginPage.css');

interface LoginPageComponentProps {
	login: (req: LoginRequest) => void;
	loginFailed: boolean;
}

interface LoginPageComponentState {
	username: string;
	password: string;
}

export class LoginPageComponent extends React.Component<LoginPageComponentProps, LoginPageComponentState> {
	public state = {
		username: '',
		password: ''
	};

	render() {
		const { username, password } = this.state;
		const { loginFailed } = this.props;

		return (
			<form onSubmit={this.onSubmit} className={classes.loginPage}>
				<div className={classes.logo}>
					<img src='/static/EmeraldCitizen.svg' alt='Emerald Citizen logo' />
				</div>
				{loginFailed && <div className={classes.errors}>There was an error logging in.</div>}
				<Input
					value={this.state.username}
					type='text'
					label='Username'
					onChange={(u: string) => this.setState({ username: u })}
				/>
				<Input
					value={this.state.password}
					type='password'
					label='Password'
					onChange={(p: string) => this.setState({ password: p })}
				/>
				<Button type='submit' raised={true} primary={true}>Login</Button>
			</form>
		);
	}

	private onSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		this.props.login(this.state);
	}
}

export const LoginPage = observer(() => {
	const authState = AuthStore.getInstance();
	const props = {
		login: authState.login,
		loginFailed: authState.loginFailed
	};

	return <LoginPageComponent {...props} />;
});