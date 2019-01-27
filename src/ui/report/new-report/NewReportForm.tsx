import * as React from 'react';
import Input from 'react-toolbox/lib/input';
import FontIcon from 'react-toolbox/lib/font_icon';
import Button from 'react-toolbox/lib/button';
import { CreateReportRequest, Person, CreateVehicleRequest, CreatePersonRequest } from 'shared/ApiClient';
import { ChipField } from '../common/ChipField';
import * as moment from 'moment';
import { GeoLocation } from './geolocation/GeoLocation';
import Card from 'react-toolbox/lib/card';

const classes = require('./NewReportForm.css');

export interface NewReportFormProps {
	report: Partial<CreateReportRequest>;
	fileUrls: string[];
	updateReport: (update: Partial<CreateReportRequest>) => void;
	saveReport: () => void;
	resetReport: () => void;
	navigateToNewPersonForm: (category: string) => void;
	navigateToEditPersonForm: (id: number) => void;
	navigateToNewVehicleForm: () => void;
	navigateToEditVehicleForm: (id: number) => void;
	uploadFile: (file: File) => void;
}

export class NewReportForm extends React.Component<NewReportFormProps> {
	render() {
		const { report, fileUrls, resetReport } = this.props;
		const people = report.people || [];
		const vehicles = report.vehicles || [];
		const date = moment(report.date ? parseInt(report.date, 10) : Date.now());
		
		return (
			<Card className={classes.reportForm}>
				<form onSubmit={this.onSubmit}>
					<h1><FontIcon value='note_add' /> Incident Report</h1>
					<h5>
						If you are witnessing an emergency situation, <br />
						please <a href='tel:911'>call 911</a> immediately
					</h5>
					<Input
						label='Date of Incidence'
						type='date'
						onChange={(value: string) => {
							const [year, month, day] = value.split('-');
							
							this.props.updateReport({
								date: date
									.set({
										year: parseInt(year, 10),
										month: parseInt(month, 10) - 1,
										date: parseInt(day, 10)
									})
									.valueOf()
									.toString()
							})
						}}
						value={date.format('YYYY-MM-DD')}
					/>
					<Input
						label='Time of Incidence'
						type='time'
						onChange={(value: string) => {
							const [hour, minute] = value.split(':');

							this.props.updateReport({
								date: date
									.set({
										hour: parseInt(hour, 10),
										minute: parseInt(minute, 10)
									})
									.valueOf()
									.toString()
							})
						}}
						value={date.format('HH:mm')}
					/>
					<GeoLocation/>
					<Input
						label='Room Number'
						value={report.room_number || ''}
						onChange={this.setValueHandler('room_number')}
					/>
					<ChipField
						label='Suspicious People'
						buttonLabel='Suspicious Person'
						color='red'
						icon='person'
						chips={people.filter(p => p.category === 'suspicious_person')}
						onChipAdd={this.handleNewPerson('suspicious_person')}
						onChipClick={this.editPerson}
						getTitle={this.getNewPersonTitle}
					/>
					<ChipField
						label='Buyer(s)'
						buttonLabel='Buyer'
						color='orange'
						icon='person'
						chips={people.filter(p => p.category === 'buyer')}
						onChipAdd={this.handleNewPerson('buyer')}
						onChipClick={this.editPerson}
						getTitle={this.getNewPersonTitle}
					/>
					<ChipField
						label='Victim(s)'
						buttonLabel='Victim'
						color='yellow'
						icon='person'
						chips={people.filter(p => p.category === 'victim')}
						onChipAdd={this.handleNewPerson('victim')}
						onChipClick={this.editPerson}
						getTitle={this.getNewPersonTitle}
					/>
					<ChipField
						label='Vehicle(s)'
						buttonLabel='Vehicle'
						color='blue'
						icon='directions_car'
						chips={vehicles}
						onChipAdd={this.handleVehicleAdd}
						onChipClick={this.editVehicle}
						getTitle={this.getVehicleTitle}
					/>
					<br/>
					<Input
						multiline={true}
						value={report.details || ''}
						label='Incident Details'
						hint='Please write everything you witness in as much detail as possible.
									Any detail could help.'
						onChange={this.setValueHandler('details')}
					/>
					<br/>
					<Input type='file' onChange={this.uploadFile}/>
					<br/>
					{fileUrls.map((url, index) => (
							<div key={index}> 
								<img src={url} width='500px' /> 
								<br/>
								<Input type='file' onChange={this.uploadFile}/>
								<br/>
							</div>
					))}
					<Button label='Reset' raised={true} primary={false} onClick={resetReport}/>
					<Button className={classes.submitButton} type='submit' label='Submit' raised={true} primary={true}/>
				</form>
			</Card>
		);
	}

	private uploadFile = (_: string, e: any) => {
		this.props.uploadFile(e.target.files[0]);
	}

	private getNewPersonTitle = (person: CreatePersonRequest) => {
		if (person.name && person.name.trim().length > 0) {
			return person.name;
		}

		const items = Object.entries(person)
			.filter(([key, value]) => value != null && key !== 'category');

		return items.reduce(
				(acc: React.ReactElement<void>[], [key, value], index: number) => {
					return acc.concat(
						<span key={index}>{key.replace('_', ' ')}: {value}{index < items.length - 1 ? ', ' : ''}</span>
					);
				}, 
				[]
			);
	}

	private handleNewPerson = (category: string) => () => this.props.navigateToNewPersonForm(category);

	private editPerson = (person: Person, index: number) => {
		const people = this.props.report.people || [];
		let categoryIndex = 0;
		let id = 0;
		
		for (let i = 0; i < people.length; i++) {
			if (people[i].category === person.category) {
				if (categoryIndex === index) {
					id = i;
					break;
				}
				
				categoryIndex++;
			}
		}

		this.props.navigateToEditPersonForm(id) ;
	};

	private handleVehicleAdd = () => this.props.navigateToNewVehicleForm();
	private editVehicle = (vehicle: CreateVehicleRequest, index: number) => this.props.navigateToEditVehicleForm(index);

	private getVehicleTitle = ({ make, model, color }: CreateVehicleRequest) => {
		return `${make || ''} ${model || ''} ${color || ''}`;
	}

	private setValue = (key: keyof CreateReportRequest, value: string | number) => this.props.updateReport({[key]:     value });

	private setValueHandler = (key: keyof CreateReportRequest) => (value: string | number) => this.setValue(key, value);
	
	private onSubmit = (e: any) => {
		e.preventDefault();    
		e.stopPropagation();
		this.props.saveReport();
	}
}