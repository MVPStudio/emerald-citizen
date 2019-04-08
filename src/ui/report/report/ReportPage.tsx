import * as React from 'react';
import { MobilePageContainer } from '../../common/components/layouts/MobilePageContainer';
import { ReportDetails } from 'shared/ApiClient';
import Card from 'react-toolbox/lib/card';
import Checkbox from 'react-toolbox/lib/checkbox';
import { List, ListItem, ListSubHeader, ListDivider } from 'react-toolbox/lib/list';
import { pick } from 'lodash';
import { Button } from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';
import { Input } from 'react-toolbox/lib/input';

const classes = require('./ReportPage.css');

export interface ReportPageProps {
	report: ReportDetails | null;
	fetching: boolean;
	disabled: boolean;
	fetchReport: () => void;
	canAddAddendum: boolean;
	saveAddendum: (text: string) => void;
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
		const { fetching, disabled, report, canAddAddendum } = this.props;

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
				<Button
					key='addendum'
					disabled={disabled}
					raised={true}
					primary={true}
					onClick={this.openAddendumDialog}
				>
					Add Addendum
				</Button>
			);
		}

		return (
			<MobilePageContainer className={classes.reportPage}>
				<Card>
					<List>
						<ListItem
							ripple={false}
							caption={(new Date(date || created_at)).toDateString()}
							legend='date'
							rightActions={reportActions}
						/>
						<ListItem
							ripple={false}
							caption={user.username}
							legend='User'
						/>
						{Object.entries({ location, room_number, details, geo_latitude, geo_longitude }).map(this.renderListItem)}
						{addendums.length > 0 && [
							<br key='vehiclesBreak' />,
							<ListSubHeader className={classes.listSubHeader} key='addendumsHeader' caption='Addendums' />,
							<ListDivider key='addendumsDivider' />
						]}
						<div>
							{addendums.map(({ text }, index) => this.renderListItem(['addendum', text], index))}
						</div>
						{people.length > 0 && [
							<br key='peopleBreak' />,
							<ListSubHeader className={classes.listSubHeader} key='peopleHeader' caption='People' />,
							<ListDivider key='peopleDivider' />
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
					</List>
					{files.length > 0 && [
						<br key='filesBreak' />,
						<ListSubHeader className={classes.listSubHeader} key='filesHeader' caption='Files' />,
						<ListDivider key='filesDivider' />
					]}
					{files.map(({ url }, index) => <div className={classes.file} key={index}> <img src={url} width='500px' /> <br /></div>)}
				</Card>

				<Dialog
					actions={this.dialogActions}
					active={this.state.showAddendumDialog}
					onEscKeyDown={this.closeAddendumDialog}
					onOverlayClick={this.closeAddendumDialog}
					title='Add Report Addendum'
				>
					{
						// @ts-ignore: autoFocus missing on type def
						<Input autoFocus='true' type='text' label='Addendum' style={{ minHeight: '60px' }} multiline={true} onChange={this.updateAddendumText} />}

				</Dialog>
				{this.renderAnalystActions()}
			</MobilePageContainer>
		);
	}

	private openAddendumDialog = () => this.setState({ showAddendumDialog: true });
	private closeAddendumDialog = () => this.setState({ showAddendumDialog: false });

	private dialogActions = [
		{ label: 'Cancel', onClick: this.closeAddendumDialog },
		{
			label: 'Save',
			primary: true,
			onClick: () => {
				this.props.saveAddendum(this.state.addendumText);
				this.closeAddendumDialog();
			}
		}
	]

	private updateAddendumText = (addendumText: string) => this.setState({ addendumText });

	private renderListItem = ([name, value]: [string, any], index: number) => {
		if (value == null) {
			return null;
		}

		if (value === true) {
			return <ListItem ripple={false} caption={name.replace('_', ' ')} key={index} />;	
		}
		
		return <ListItem ripple={false} caption={value} legend={name.replace('_', ' ')} key={index} />;
	}
}