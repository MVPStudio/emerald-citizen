import * as React from 'react';
import { Report } from 'shared/ApiClient';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import FontIcon from 'react-toolbox/lib/font_icon';
import { Link } from 'ui/routing/Link';

const classes = require('./ReportsTable.css');

export interface ReportsTableProps {
	reports: Report[];
}

const LinkedTableCell: React.SFC<{ id: number }> = ({ id, children }) => (
	<TableCell><Link routeName='report' routeParams={{ id }}>{children}</Link></TableCell>
);

export class ReportsTable extends React.PureComponent<ReportsTableProps> {

	render() {
		const { reports } = this.props;

		return (
			<Table selectable={false} className={classes['reports-table']}>
				{
					reports.length > 0 &&
					<TableHead>
						<TableCell>Last Updated</TableCell>
						<TableCell>Submit Date</TableCell>
						<TableCell>Submitted User</TableCell>
						<TableCell>Location</TableCell>
						<TableCell>Details</TableCell>
						<TableCell>Interesting</TableCell>
						<TableCell>Validated</TableCell>
					</TableHead>
				}
				{reports.map(({ id, date, user, location, details, created_at, updated, marked_interesting, marked_validated }, idx) => {

					return (
						<TableRow key={idx}>
							<LinkedTableCell id={id}>{new Date(updated).toDateString()}</LinkedTableCell>
							<LinkedTableCell id={id}>{(new Date(date || created_at)).toDateString()}</LinkedTableCell>
							<TableCell>{user.username}</TableCell>
							<TableCell>{location}</TableCell>
							<TableCell>{details}</TableCell>
							<TableCell>{marked_interesting && <FontIcon value='warning' />}</TableCell>
							<TableCell>{marked_validated && <FontIcon value='done' />}</TableCell>
						</TableRow>
					);
				})}
			</Table>
		);
	}
}