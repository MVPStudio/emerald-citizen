import * as React from 'react';
import Input from 'react-toolbox/lib/input';
import FontIcon from 'react-toolbox/lib/font_icon';
import Button from 'react-toolbox/lib/button';
import { CreateReportRequest, Person, CreateVehicleRequest, CreatePersonRequest } from 'shared/ApiClient';
import { ChipField } from '../common/ChipField';
import * as moment from 'moment';
import { GeoLocationContainer } from './geolocation/GeoLocationContainer';
import Card from 'react-toolbox/lib/card';
import { UploadFiles } from '../common/UploadFiles';

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
	fileUploading: boolean;
	removeFile: (idx: number) => void;
	removePerson: (person: CreatePersonRequest, idx: number) => void;
	removeVehicle: (idx: number) => void;
}

export class NewReportForm extends React.Component<NewReportFormProps> {
	render() {
		const { 
			report, 
			fileUrls, 
			resetReport, 
			fileUploading, 
			removePerson,
			uploadFile,
			removeFile
		} = this.props;
		const people = report.people || [];
		const vehicles = report.vehicles || [];
		const date = moment(report.date ? parseInt(report.date, 10) : Date.now());
		
		return (
			<Card className={classes.reportForm}>
				<form onSubmit={this.onSubmit}>
					<h1><FontIcon value='note_add' /> Incident Report</h1>
					<Input
						className={classes.dateInput}
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
						className={classes.timeInput}
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
					<div style={{clear: 'both'}}/>
					<GeoLocationContainer/>
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
						onDelete={removePerson}
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
						onDelete={removePerson}
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
						onDelete={removePerson}
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
						onDelete={this.handleRemoveVehicle}
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
					<UploadFiles 
						fileUrls={fileUrls}
						uploadFile={uploadFile}
						fileUploading={fileUploading}
						removeFile={removeFile}
					/>
					<Button label='Clear' raised={true} accent={true} onClick={resetReport}/>
					<Button className={classes.submitButton} type='submit' label='Submit' raised={true} primary={true}/>
				</form>
			</Card>
		);
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
	private handleRemoveVehicle = (vehicle: CreateVehicleRequest, index: number) => this.props.removeVehicle(index);

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