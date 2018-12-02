import * as React from 'react';
import { ReportPage } from 'shared/ApiClient';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import Card from 'react-toolbox/lib/card';
import { Link } from 'ui/routing/Link';
import FontIcon from 'react-toolbox/lib/font_icon';
import Button from 'react-toolbox/lib/button';

const classes = require('./ReportsTablePage.css');

export interface ReportsTablePageProps {
	fetchReports: () => void;
	reports: ReportPage[];
	goToReportPage: (id: number) => void;
	page?: number;
	nextPage?: number;
	prevPage?: number;
	showNextPage: boolean;
	showPrevPage: boolean;
}

export class ReportsTable extends React.Component<ReportsTablePageProps> {
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
					<Table selectable={false}>
						<TableHead>
							<TableCell>Last Updated</TableCell>
							<TableCell>Date</TableCell>
							<TableCell>Location</TableCell>
							<TableCell>Details</TableCell>
							<TableCell>Interesting</TableCell>
							<TableCell>Validated</TableCell>
						</TableHead>
						{reports.map(({ id, date, location, details, created_at, updated, marked_interesting, marked_validated }, idx) => {
							const onClick = this.cellClickHandler(id);

							return (
								<TableRow key={idx}>
									<TableCell onClick={onClick}>{new Date(updated).toDateString()}</TableCell>
									<TableCell onClick={onClick}>{(new Date(date || created_at)).toDateString()}</TableCell>
									<TableCell onClick={onClick}>{location}</TableCell>
									<TableCell onClick={onClick}>{details}</TableCell>
									<TableCell onClick={onClick}>{marked_interesting && <FontIcon value='warning' />}</TableCell>
									<TableCell onClick={onClick}>{marked_validated && <FontIcon value='done' />}</TableCell>
								</TableRow>
							);
						})}
					</Table>
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

	private cellClickHandler = (id: number) => () => this.props.goToReportPage(id);
}