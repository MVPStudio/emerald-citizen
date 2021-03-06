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
	loggingIn: boolean;
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
		const { loginFailed, loggingIn } = this.props;

		return (
			<form onSubmit={this.onSubmit} className={classes.loginPage}>
				<div className={classes.logo}>
					<img src='/static/EmeraldCitizen.svg' alt='Emerald Citizen logo' />
				</div>
				<div className={classes.errors} style={{ visibility: loginFailed ? 'visible' : 'hidden' }}>There was an error logging in.</div>

				{/* 
			  // @ts-ignore: autoFocus missing on type def  */}
				<Input
					autoFocus={true}
					value={username}
					type='text'
					label='Username'
					onChange={(u: string) => this.setState({ username: u })}
				/>
				<Input
					value={password}
					type='password'
					label='Password'
					onChange={(p: string) => this.setState({ password: p })}
				/>
				<Button type='submit' raised={true} primary={true} disabled={loggingIn}>Login</Button>
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
		loginFailed: authState.loginFailed,
		loggingIn: authState.loggingIn
	};

	return <LoginPageComponent {...props} />;
});