import * as React from 'react';
import { MobilePageContainer } from '../../layouts/MobilePageContainer';
import { Report } from 'shared/ApiClient';
import Card from 'react-toolbox/lib/card';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import { pick } from 'lodash';
import { Button } from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';
import { Input } from 'react-toolbox/lib/input';

const classes = require('./ReportPageComponent.css');

export interface ReportPageComponentProps {
	report: Report | null;
	fetching: boolean;
	fetchReport: () => void;
	canAddAddendum: boolean;
	saveAddendum: (text: string) => void;
	canMarkNotable: boolean;
}

interface ReportPageState {
	showAddendumDialog: boolean;
	addendumText: string;
}

export class ReportPageComponent extends React.Component<ReportPageComponentProps, ReportPageState> {
	constructor(props: ReportPageComponentProps) {
		super(props);
		this.state = {
			showAddendumDialog: false,
			addendumText: ''
		}
	}

	componentDidMount() {
		this.props.fetchReport();
	}

	render() {
		const { fetching, report, canAddAddendum, canMarkNotable } = this.props;

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
			addendums
		} = report;

		const reportActions = [];

		if (canAddAddendum) {
			reportActions.push(
				<Button key='addendum' raised={true} primary={true} onClick={this.openAddendumDialog}>Add Addendum</Button>
			);
		}

		// if (canMarkNotable) {
		// 	reportActions.push(
		// 		<ListCheckbox
		// 			checked={this.state.check1}
		// 			label='Checked option'
		// 			onChange={this.handleChange.bind(this, 'check1')}
		// 		/>
		// 	);
		// }

		return (
			<MobilePageContainer className={classes.reportPage}>
				<Card>
					<List>
						<ListItem
							ripple={false}
							caption={(new Date(date)).toDateString()}
							legend='date'
							rightActions={reportActions}
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
												'details'
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

	private renderListItem = ([name, value]: [string, any], index: number) => value == null
		? null
		: <ListItem ripple={false} caption={value} legend={name.replace('_', ' ')} key={index} />;
}