import * as React from 'react';
import { Report } from 'shared/ApiClient';
import Card from 'react-toolbox/lib/card';
import { Link } from 'ui/routing/Link';
import Button from 'react-toolbox/lib/button';
import { ReportsTable } from '../common/ReportsTable';

const classes = require('./ReportsTablePage.css');

export interface ReportsTablePageProps {
	fetchReports: () => void;
	reports: Report[];
	goToReportPage: (id: number) => void;
	page?: number;
	nextPage?: number;
	prevPage?: number;
	showNextPage: boolean;
	showPrevPage: boolean;
}

export class ReportsTablePage extends React.Component<ReportsTablePageProps> {
	componentDidMount() {
		this.props.fetchReports();
	}

	componentDidUpdate(prevProps: ReportsTablePageProps) {
		if (prevProps.page !== this.props.page) {
			this.props.fetchReports();
		}
	}

	render() {
		const { reports, nextPage, prevPage, showNextPage, showPrevPage } = this.props;

		return (
			<div className={classes.reports}>
				<Card>
					<h2>Reports</h2>
					<ReportsTable reports={reports} />
				</Card>
				<div className={classes.pageLinks}>
					{
						<Link
							className={classes.pageLink}
							routeName={showPrevPage ? 'reportsTable' : ''}
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
							routeName={showNextPage ? 'reportsTable' : ''}
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

	private cellClickHandler = (id: number) => this.props.goToReportPage(id);
}