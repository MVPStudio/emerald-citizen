import * as React from 'react';
import { MobilePageContainer } from '../../common/components/layouts/MobilePageContainer';
import { Link } from '../../routing/Link';
import Card from 'react-toolbox/lib/card';

export const NewReportSucceessPage = () => (
	<MobilePageContainer>
		<Card style={{ padding: '20px' }}>
			<h1>Thank you for submitting a report.</h1>
			<p>Every bit of information helps free sex trafficking victims.</p>
			<p><Link routeName='myReports'>View your reports</Link></p>
			<p><Link routeName='newReport'>File a another report</Link></p>
		</Card>
	</MobilePageContainer>
);