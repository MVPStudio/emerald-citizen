import * as React from 'react';
import Card from 'react-toolbox/lib/card';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import { SearchReportsRequest, Report } from 'shared/ApiClient';
import { ReportsTable } from '../common/ReportsTable';

const classes = require('./ReportsSearchPage.css');

export interface ReportsSearchPageProps {
	reset: VoidFunction;
	search: VoidFunction;
	searching: boolean;
	searchParams: SearchReportsRequest;
	onLocationChange: (value: string) => void;
	onDetailsChange: (value: string) => void;
	reports: Report[];
}

export class ReportsSearchPage extends React.Component<ReportsSearchPageProps> {
	hasSearched = false;

	componentDidMount() {
		this.props.reset();
	}

	render() {
		const {
			searchParams: {
				location,
				details,
				marked_interesting,
				marked_validated
			},
			onLocationChange,
			onDetailsChange,
			searching,
			reports
		} = this.props;

		return (
			<div className={classes.reportsSearchPage}>
				<Card>
					<h2>Reports Search</h2>

					<form onSubmit={this.onSubmit}>
						<Input
							value={location}
							label='Search Locations'
							onChange={onLocationChange}
						/>
						<Input
							value={details}
							label='Search Details'
							onChange={onDetailsChange}
						/>
						<Button type='submit' raised={true} primary={true} disabled={searching}>Search</Button>
					</form>
				</Card>
				<Card>
					{
						this.hasSearched && reports.length === 0
							? <h4>No reports found.</h4>
							: <ReportsTable reports={reports} />
					}
				</Card>
			</div>
		);
	}

	private onSubmit = (e: any) => {
		this.hasSearched = true;
		e.preventDefault();
		e.stopPropagation();
		this.props.search();
	}
}