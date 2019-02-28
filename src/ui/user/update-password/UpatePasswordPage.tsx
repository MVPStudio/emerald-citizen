import * as React from 'react';
import { MobilePageContainer } from '../../common/components/layouts/MobilePageContainer';
import { User } from 'shared/ApiClient';
import Card from 'react-toolbox/lib/card';
import { ListItem } from 'react-toolbox/lib/list';
import { Input } from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';

const classes = require('./UpdatePasswordPage.css');

export interface UpdatePasswordPageProps {
	user: User | null;
	password: string | null;
	fetching: boolean;
	disabled: boolean;
	fetchUser: VoidFunction;
	updatePassword: (pw: string) => void;
	submit: VoidFunction;
	resetPassword: VoidFunction;
}

export class UpdatePasswordPage extends React.Component<UpdatePasswordPageProps> {
	state = {
		showAddendumDialog: false,
		addendumText: ''
	}

	componentDidMount() {
		this.props.fetchUser();
	}

	render() {
		const { fetching, disabled, user, password, updatePassword, submit } = this.props;
		
		if (fetching) {
			return null;
		}

		if (user == null) {
			return <h1>User Not Found</h1>;
		}

		const { username } = user;

		return (
			<MobilePageContainer>
				<Card className={classes.updatePasswordPage}>
					<form onSubmit={this.onSubmit}>
						<p className={classes.header}>Update password for <strong>{username}</strong></p>
						{/* 
					  // @ts-ignore: autoFocus missing on type def */}
						<Input
							autoFocus={true}
							label='New Password'
							hint='Must be at least 5 characters long'
							value={password}
							onChange={updatePassword}
						/>
						<Button type='submit' disabled={disabled} primary={true} raised={true}>Submit</Button>
					</form>
				</Card>
			</MobilePageContainer>
		);
	}

	private onSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		this.props.submit();
	}
}