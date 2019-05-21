import * as React from 'react';
import { MobilePageContainer } from '../../common/components/layouts/MobilePageContainer';
import { ReportDetails } from 'shared/ApiClient';
import Card, { CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import Checkbox from 'react-toolbox/lib/checkbox';
import { ListSubHeader, ListDivider } from 'react-toolbox/lib/list';
import { pick } from 'lodash';
import { Button } from 'react-toolbox/lib/button';
import { Link } from 'ui/routing/Link';

const classes = require('./ReportPage.css');

export interface ReportPageProps {
	report: ReportDetails | null;
	fetching: boolean;
	disabled: boolean;
	fetchReport: () => void;
	canAddAddendum: boolean;
	isAnalyst: boolean;
	toggleInteresting: () => void;
	toggleValidated: () => void;
}

interface ReportPageState {
	showAddendumDialog: boolean;
	addendumText: string;
}

export class ReportPage extends React.Component<ReportPageProps, ReportPageState> {
	constructor(props: ReportPageProps) {
		super(props);
		this.state = {
			showAddendumDialog: false,
			addendumText: ''
		}
	}

	componentDidMount() {
		this.props.fetchReport();
	}

	private renderAnalystActions() {
		const { disabled, report, isAnalyst, toggleInteresting, toggleValidated } = this.props;

		if (!isAnalyst || report == null) {
			return null;
		}

		const {
			marked_interesting,
			marked_interesting_dt_tm,
			marked_interesting_user,
			marked_validated,
			marked_validated_dt_tm,
			marked_validated_user
		} = report;

		return (
			<Card className={classes.analystActions}>
				<Checkbox
					disabled={disabled}
					label='Interesting'
					checked={marked_interesting}
					onChange={toggleInteresting}
				/>
				{
					marked_interesting_user &&
					<div className={classes.analystInfo}><p>{marked_interesting_user.username}</p><p>{(new Date(marked_interesting_dt_tm)).toDateString()}</p></div>
				}
				<Checkbox
					disabled={disabled}
					label='Validated'
					checked={marked_validated}
					onChange={toggleValidated}
				/>
				{
					marked_validated_user &&
					<div className={classes.analystInfo}><p>{marked_validated_user.username}</p><p>{(new Date(marked_validated_dt_tm)).toDateString()}</p></div>
				}
			</Card>
		);
	}

	render() {
		const {
			fetching,
			disabled,
			report,
			canAddAddendum
		} = this.props;

		if (fetching) {
			return null;
		}

		if (report == null) {
			return <h1>Report Not Found</h1>;
		}

		const {
			date,
			location,
			room_number,
			details,
			geo_latitude,
			geo_longitude,
			people,
			vehicles,
			addendums,
			created_at,
			files,
			user
		} = report;

		const reportActions = [];

		if (canAddAddendum) {
			reportActions.push(
				<Link
					routeName='reportAddendum'
					routeParams={{ id: report.id }}
					key='addendum'
				>
					<Button
						disabled={disabled}
						raised={true}
						primary={true}
					>
						Add Addendum
					</Button>
				</Link>
			);
		}

		return (
			<MobilePageContainer className={classes.reportPage}>
				<Card>
					<CardActions>{reportActions}</CardActions>
					<CardTitle subtitle='Date' />
					<CardText>{(new Date(date || created_at)).toDateString()}</CardText>

					<CardTitle subtitle='User' />
					<CardText>{user.username}</CardText>

					{Object.entries({ location, room_number, details, geo_latitude, geo_longitude }).map(this.renderListItem)}
					{addendums.length > 0 && [
						<br key='addendumsBreak' />,
						<CardTitle title='Addendums' key='addendumsHeader' />
					]}
					<div>
						{addendums.map(({ text }, index) => this.renderListItem(['addendum', text], index))}
					</div>
					{people.length > 0 && [
						<br key='peopleBreak' />,
						<CardTitle title='People' key='peopleHeader' />
					]}
					<div>
						{
							people.map(
								(person, index) => ([
									Object.entries(
										pick(person, [
											'category',
											'name',
											'sex',
											'height',
											'weight',
											'skin_color',
											'hair_color',
											'hair_length',
											'eye_color',
											'details',
											'has_tatoos',
											'has_piercings'
										])
									)
										.map(this.renderListItem),
									index < people.length - 1 && <ListDivider inset={true} key={`person-${index}`} />
								])
							)
						}
					</div>
					{vehicles.length > 0 && [
						<br key='vehiclesBreak' />,
						<ListSubHeader className={classes.listSubHeader} key='vehiclesHeader' caption='Vehicles' />,
						<ListDivider key='vehiclesDivider' />
					]}
					<div>
						{
							vehicles.map(
								(vehicle, index) => [
									Object.entries(
										pick(vehicle, [
											'color',
											'make',
											'model',
											'license_plate'
										])
									)
										.map(this.renderListItem),
									index < vehicles.length - 1 && <ListDivider key={`vehicle-${index}`} />
								])
						}
					</div>

					{files.length > 0 && [
						<br key='filesBreak' />,
						<ListSubHeader className={classes.listSubHeader} key='filesHeader' caption='Files' />,
						<ListDivider key='filesDivider' />
					]}
					{files.map(({ url }, index) => <div className={classes.file} key={index}> <img src={url} width='500px' /> <br /></div>)}
				</Card>
				{this.renderAnalystActions()}
			</MobilePageContainer>
		);
	}

	private renderListItem = ([name, value]: [string, any], index: number) => {
		if (value == null || value === false) {
			return null;
		}

		if (value === true) {
			return <CardTitle subtitle={name.replace('_', ' ')} />;
		}

		return (
			<div>
				<CardTitle subtitle={name.replace('_', ' ')} />
				<CardText>{value}</CardText>
			</div>
		);
	}
}
