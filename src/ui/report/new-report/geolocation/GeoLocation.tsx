import * as React from 'react'
import { Button } from 'react-toolbox/lib/button';
import { Input } from 'react-toolbox/lib/input';

const classes = require('./GeoLocation.css');

export interface GeoLocationProps {
	geoAvailable: boolean;
	geoError: string | null;
	location?: string;
	locationSuggestions: string[];
	setCurrentLocation: () => void;
	setLocation: (location: string, wasSuggested?: boolean) => void;
	clearLocationSuggestions: () => void;
}

export class GeoLocation extends React.Component<GeoLocationProps> {
	suggestionClickHandler = (suggestedLocation: string) => () => {
		this.props.setLocation(suggestedLocation, true);
	}

	inputHandler = (location: string) => {
		this.props.setLocation(location);
	}

	render() {
		const { location, geoError, geoAvailable, locationSuggestions, setCurrentLocation, clearLocationSuggestions } = this.props;

		return (
			<div className={classes.geoLocation}>
				<Input
					className={classes.input}
					label='Location of Incident'
					onChange={this.inputHandler}
					value={location || ''}
					error={geoError}
				/>
				{
					geoAvailable &&
					<Button className={classes.nearMe} raised={true} primary={true} icon='near_me' onClick={setCurrentLocation} />
				}
				{locationSuggestions && locationSuggestions.length > 0 &&
					<div className={classes.locationSuggestions}>
						<h5>Did You Mean?</h5>
						<Button mini={true} icon='clear' onClick={clearLocationSuggestions} />
					</div>
				}
				{locationSuggestions.map((suggestedLocation, i) =>
					<p className={classes.locationSuggestion} key={i} onClick={this.suggestionClickHandler(suggestedLocation)}>
						{suggestedLocation}
					</p>
				)}
			</div>
		)
	}
}