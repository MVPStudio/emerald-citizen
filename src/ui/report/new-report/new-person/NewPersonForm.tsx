import * as React from 'react';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import { CreatePersonRequest } from 'shared/ApiClient';
import { 
	SEX_OPTIONS, 
	HAIR_COLOR_OPTIONS, 
	HAIR_LENGTH_OPTIONS,
	EYE_COLOR_OPTIONS, 
	HEIGHT_OPTIONS, 
	WEIGHT_OPTIONS, 
	AGE_OPTIONS ,
	SKIN_TONE_OPTIONS
} from '../../common/personOptions';
import { Select } from 'ui/common/components/Select';
import Card from 'react-toolbox/lib/card';
import Checkbox from 'react-toolbox/lib/checkbox';

const classes = require('./NewPersonForm.css');

export interface NewPersonFormProps {
	person: Partial<CreatePersonRequest>
	updatePerson: (update: Partial<CreatePersonRequest>) => void;
	savePerson: () => void;
	resetPerson: () => void;
	allowSavePerson: boolean;
	personIndex?: number;
}

export class NewPersonForm extends React.Component<NewPersonFormProps> {

	render() {
		const { allowSavePerson, person, resetPerson, personIndex } = this.props;
		const { 
			name, 
			category, 
			age, 
			sex, 
			hair_color, 
			eye_color, 
			height, 
			weight, 
			hair_length, 
			skin_color, 
			details,
			has_piercings,
			has_tatoos
		} = person;
		const categoryDisplay = (category || '').replace('_', ' ');
		const isNewPerson = personIndex == null;

		return (
			<Card>
				<form onSubmit={this.onSubmit} className={classes.personForm}>
					<h1>{isNewPerson ? `Add ${categoryDisplay}` : `Edit ${categoryDisplay} ${personIndex}`}</h1>
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
					<Select
						onChange={this.updateField('skin_color')}
						label='Skin Tone'
						options={SKIN_TONE_OPTIONS}
						value={skin_color || ''}
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
					<Select
						onChange={this.updateField('hair_length')}
						label='Hair Length'
						options={HAIR_LENGTH_OPTIONS}
						value={hair_length || ''}
					/>
					<Select
						onChange={this.updateField('eye_color')}
						label='Eye Color'
						options={EYE_COLOR_OPTIONS}
						value={eye_color || ''}
					/>
					<Checkbox
						checked={has_tatoos || false}
						label='Has Tatoos?'
						onChange={this.updateField('has_tatoos')}
					/>
					<Checkbox
						checked={has_piercings || false}
						label='Has Piercings?'
						onChange={this.updateField('has_piercings')}
					/>
					<Input
						multiline={true}
						label='Noticeable Characteristics / Other Details'
						onChange={this.updateField('details')}
						value={details}
					/>
					{isNewPerson && <Button label='Clear' raised={true} primary={false} onClick={resetPerson} />}
					<Button className={classes.submitButton} type='submit' label='Save' raised={true} primary={true} disabled={!allowSavePerson} />
				</form>
			</Card>
		);
	}

	private updateField = (key: keyof CreatePersonRequest) => (value: string) => this.props.updatePerson({ [key]: value });

	private onSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		this.props.savePerson();
	}
}