import * as React from 'react';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import { CreatePersonRequest } from 'shared/ApiClient';
import { SEX_OPTIONS, HAIR_COLOR_OPTIONS, EYE_COLOR_OPTIONS, HEIGHT_OPTIONS, WEIGHT_OPTIONS, AGE_OPTIONS } from '../../common/personOptions';
import { Select } from 'ui/common/components/Select';

const classes = require('./NewPersonFormComponent.css');

export interface NewPersonFormProps {
	person: Partial<CreatePersonRequest>
	updatePerson: (update: Partial<CreatePersonRequest>) => void;
	savePerson: () => void;
	allowSavePerson: boolean;
}

export class NewPersonFormComponent extends React.Component<NewPersonFormProps> {

	render() {
		const { allowSavePerson, person } = this.props;
		const { name, age, sex, hair_color, eye_color, height, weight, hair_length, skin_color, details } = person;

		return (
			<form onSubmit={this.onSubmit} className={classes.personForm}>
				<h1>Add Person</h1>
				<Input
					label='Name'
					onChange={this.updateField('name')}
					value={name || ''}
				/>
				<Select
					onChange={this.updateField('age')}
					label='Age'
					options={AGE_OPTIONS}
					value={age || ''}
				/>
				<Select
					onChange={this.updateField('sex')}
					label='Sex'
					options={SEX_OPTIONS}
					value={sex || ''}
				/>
				<Input
					label='Observed Race'
					value={skin_color}
					onChange={this.updateField('skin_color')}
				/>
				<Select
					onChange={this.updateField('height')}
					label='Approx. Height'
					options={HEIGHT_OPTIONS}
					value={height || ''}
				/>
				<Select
					onChange={this.updateField('weight')}
					label='Approx. Weight'
					options={WEIGHT_OPTIONS}
					value={weight || ''}
				/>
				<Select
					onChange={this.updateField('hair_color')}
					label='Hair Color'
					options={HAIR_COLOR_OPTIONS}
					value={hair_color || ''}
				/>
				<Input
					label='Hair Length'
					onChange={this.updateField('hair_length')}
					value={hair_length || ''}
				/>
				<Select
					onChange={this.updateField('eye_color')}
					label='Eye Color'
					options={EYE_COLOR_OPTIONS}
					value={eye_color || ''}
				/>
				<Input
					multiline={true}
					label='Noticeable Characteristics / Other Details'
					onChange={this.updateField('details')}
					value={details}
				/>
				<Button type='submit' label='Save' raised={true} primary={true} disabled={!allowSavePerson} />
			</form>
		);
	}

	private updateField = (key: keyof CreatePersonRequest) => (value: string) => this.props.updatePerson({ [key]: value });

	private onSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		this.props.savePerson();
	}
}