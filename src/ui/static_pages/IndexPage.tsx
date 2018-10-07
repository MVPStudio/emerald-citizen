import * as React from 'react';
import { Link } from '../routing/Link';
import { Button } from 'react-toolbox/lib/button';

const classes = require('./IndexPage.css');

export const IndexPage = () => (
	<div className={classes.indexPage}>
		<div className={classes.logo}>
			<img src='/static/EmeraldCitizen.svg' alt='Emerald Citizen logo' />
			<p>
				<Link routeName='login'><Button raised={true} label='Login' primary={true}/></Link>
			</p>
		</div>
	</div>
);