import * as React from 'react'
import AppBar from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import { Link } from 'ui/routing/Link';
import { observer } from 'mobx-react';
import { AuthStore } from 'ui/auth/AuthStore';
import { User, UserRole } from 'shared/ApiClient';
import { RouterStore } from 'ui/routing/RouterStore';
import Drawer from 'react-toolbox/lib/drawer';
import { List, ListItem, ListDivider } from 'react-toolbox/lib/list';
import { Button } from 'react-toolbox/lib/button';

const classes = require('./NavBar.css');

export interface NavBarComponentProps {
	user: User | null;
	isLoggedIn: boolean;
	logout: () => void;
	currentRoute?: string;
}

export interface NavBarComponentState {
	drawerOpen: boolean;
}

export class NavBarComponent extends React.Component<NavBarComponentProps, NavBarComponentState> {
	constructor(props: NavBarComponentProps) {
		super(props);
		this.state = { drawerOpen: false };
	}

	componentDidUpdate(prevProps: NavBarComponentProps) {
		if (prevProps.currentRoute !== this.props.currentRoute) {
			this.closeDrawer();
		}
	}

	render() {
		const { currentRoute, user, isLoggedIn } = this.props;

		if (!isLoggedIn) {
			return null;
		}

		const { drawerOpen } = this.state;
		const role = user ? user.role : '';
		const navLinks = [];

		if (role === UserRole.admin || role === UserRole.reporter) {
			navLinks.push(
				<Link key='navNewReport' routeName='newReport'>
					<ListItem caption='New Report' disabled={currentRoute === 'newReport'} />
				</Link>,
				<Link key='navMyReportsTable' routeName='myReports'>
					<ListItem caption='My Reports' disabled={currentRoute === 'myReports'} />
				</Link>
			)
		}

		if (role === UserRole.admin || role === UserRole.analyst) {
			navLinks.push(
				<ListDivider key='analystDivider' />,
				<Link key='navReportsTable' routeName='reportsTable'>
					<ListItem caption='Reports' disabled={currentRoute === 'reportsTable'} />
				</Link>,
				<Link key='navSearchReports' routeName='reportsSearch'>
					<ListItem caption='Search Reports' disabled={currentRoute === 'reportsSearch'} />
				</Link>,
				<Link key='navSearchPeople' routeName='peopleSearch'>
					<ListItem caption='Search People' disabled={currentRoute === 'peopleSearch'} />
				</Link>,
				<Link key='navSearchVehicles' routeName='vehiclesSearch'>
					<ListItem caption='Search Vehicles' disabled={currentRoute === 'vehiclesSearch'} />
				</Link>,
				<Link key='navReportsMap' routeName='reportsMap'>
					<ListItem caption='Map' disabled={currentRoute === 'reportsMap'} />
				</Link>
			)
		}

		if (role === UserRole.admin) {
			navLinks.push(
				<ListDivider key='adminDivider' />,
				<Link routeName='usersNew' key='navNewUser'>
					<ListItem caption='New User' disabled={currentRoute === 'usersNew'} />
				</Link>,
				<Link routeName='usersTable' key='navUsersTable'>
					<ListItem caption='Users' disabled={currentRoute === 'usersTable'} />
				</Link>
			)
		}

		return (
			<AppBar className={classes.navBar} leftIcon='menu' onLeftIconClick={this.openDrawer} fixed={false}>
				<Drawer className={classes.navBarDrawer} active={drawerOpen} onOverlayClick={this.closeDrawer}>
					<List selectable={true} ripple={true} onClick={this.closeDrawer}>
						{navLinks}
					</List>
				</Drawer>
				{
					user &&
					<Navigation type='horizontal'>
						<Button className={classes.nineoneone} raised={true} accent={true} onClick={this.call911} label='911' />
						<Button raised={true} onClick={this.handleLogout} label='Logout' />
					</Navigation>
				}
			</AppBar>
		);
	}

	private handleLogout = () => {
		this.props.logout();
	}

	private openDrawer = () => {
		this.setState({ drawerOpen: true });
	}

	private closeDrawer = () => {
		this.setState({ drawerOpen: false });
	}

	private call911 = () => {
		window.open('tel:911');
	}
}

export const NavBar = observer(() => {
	const authStore = AuthStore.getInstance();
	const routerStore = RouterStore.getInstance();
	const props: NavBarComponentProps = {
		isLoggedIn: authStore.isLoggedIn,
		logout: authStore.logout,
		currentRoute: routerStore.route ? routerStore.route.name : undefined,
		user: authStore.user
	};

	return <NavBarComponent {...props} />;
});