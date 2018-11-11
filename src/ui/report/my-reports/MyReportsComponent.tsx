import * as React from 'react';
import { MobilePageContainer } from '../../layouts/MobilePageContainer';
import { Report } from 'shared/ApiClient';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import Card from 'react-toolbox/lib/card';

const classes = require('./MyReportsComponent.css');

export interface MyReportsPageComponentProps {
	myReports: Report[];
	fetchMyReports: () => void;
	goToReportPage: (id: number) => void;
}

export class MyReportsPageComponent extends React.Component<MyReportsPageComponentProps> {
	componentDidMount() {
		this.props.fetchMyReports();
	}

	render() {
		const { myReports } = this.props;

		return (
			<MobilePageContainer className={classes.myReports}>
				<Card>
					<h2>My Reports</h2>
					<Table selectable={false}>
						<TableHead>
							<TableCell>Date</TableCell>
							<TableCell>Location</TableCell>
							<TableCell>Details</TableCell>
						</TableHead>
						{myReports.map(({ id, date, location, details, created_at }, idx) => (

							<TableRow key={idx}>
								<TableCell onClick={this.cellClickHandler(id)}>{(new Date(date || created_at)).toDateString()}</TableCell>
								<TableCell onClick={this.cellClickHandler(id)}>{location}</TableCell>
								<TableCell onClick={this.cellClickHandler(id)}>{details}</TableCell>
							</TableRow>
						))}
					</Table>
				</Card>
			</MobilePageContainer>
		);
	}

	private cellClickHandler = (id: number) => () => this.props.goToReportPage(id);
}