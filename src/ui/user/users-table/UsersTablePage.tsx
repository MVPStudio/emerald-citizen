import * as React from 'react';
import { User, UserRole } from 'shared/ApiClient';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import Card from 'react-toolbox/lib/card';
import { Link } from 'ui/routing/Link';
import Button from 'react-toolbox/lib/button';
import { userRoleOptions } from 'ui/common/dropdownOptions';

const classes = require('./UsersTablePage.css');

export interface UsersTableProps {
	fetchUsers: () => void;
	users: User[];
	page?: number;
	nextPage?: number;
	prevPage?: number;
	showNextPage: boolean;
	showPrevPage: boolean;
	activateUser: (id: number) => void;
	deactivateUser: (id: number) => void;
	updateUserRole: (id: number, role: UserRole) => void;
}

export class UsersTable extends React.Component<UsersTableProps> {
	componentDidMount() {
		this.props.fetchUsers();
	}

	componentDidUpdate(prevProps: UsersTableProps) {
		if (prevProps.page !== this.props.page) {
			this.props.fetchUsers();
		}
	}

	render() {
		const { users, nextPage, prevPage, showNextPage, showPrevPage } = this.props;

		return (
			<div className={classes.users}>
				<Card>
					<h2>Users</h2>
					<Table selectable={false}>
						<TableHead>
							<TableCell>ID</TableCell>
							<TableCell>Username</TableCell>
							<TableCell>Role</TableCell>
							<TableCell>Registered</TableCell>
							<TableCell>{' '}</TableCell>
							<TableCell>{' '}</TableCell>
						</TableHead>
						{users.map(({ id, username, role, created_at, is_active }, idx) => {
							return (
								<TableRow key={idx}>
									<TableCell>{id}</TableCell>
									<TableCell>{username}</TableCell>
									<TableCell>
										<select onChange={this.updateUserRoleHandler(id)}>
											{userRoleOptions.map(({ value }) => <option key={value}>{value}</option>)}
										</select>
									</TableCell>
									<TableCell>{(new Date(created_at)).toDateString()}</TableCell>
									<TableCell>
										<Link routeName='userUpdatePassword' routeParams={{ id }}>
											<Button primary={true}>
												Update Password
											</Button>
										</Link>
									</TableCell>
									<TableCell>
										{
											is_active
												? <Button accent={true} onClick={this.deactivateUserHandler(id)}>De-Activate</Button>
												: <Button primary={true} onClick={this.activateUserHandler(id)}>Activate</Button>
										}

									</TableCell>
								</TableRow>
							);
						})}
					</Table>
				</Card>
				<div className={classes.pageLinks}>
					{
						<Link
							className={classes.pageLink}
							routeName={showPrevPage ? 'usersTable' : ''}
							routeParams={{ page: prevPage }}
						>
							<Button primary={true} raised={true} disabled={!showPrevPage}>
								Previous Page
							</Button>
						</Link>
					}
					{
						<Link
							className={classes.pageLink}
							routeName={showNextPage ? 'usersTable' : ''}
							routeParams={{ page: nextPage }}
						>
							<Button primary={true} raised={true} disabled={!showNextPage}>
								Next Page
							</Button>
						</Link>
					}
				</div>
			</div>
		);
	}

	private deactivateUserHandler = (id: number) => () => this.props.deactivateUser(id);
	private activateUserHandler = (id: number) => () => this.props.activateUser(id);
	private updateUserRoleHandler = (id: number) => (e: React.ChangeEvent<HTMLSelectElement>) => this.props.updateUserRole(id, e.target.value as UserRole);
}