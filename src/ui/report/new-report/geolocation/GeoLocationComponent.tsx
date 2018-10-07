import * as React from 'react'
import { findDOMNode } from 'react-dom';
import { Button } from 'react-toolbox/lib/button';
import { Input } from 'react-toolbox/lib/input';
import { Key } from 'ts-keycode-enum';

const classes = require('./GeoLocationComponent.css');

export interface GeoLocationComponentProps {
	geoAvailable: boolean;
	geoError: string | null;
	location?: string;
	setCurrentLocation: () => void;
	setLocation: (location: string) => void;
}

export class GeoLocationComponent extends React.Component<GeoLocationComponentProps> {
	componentDidMount() {
		if (this.rootComponent) {
			// Re-fire input and keydown events from toolbox input to autocomplete (monkey patch)
			const node = findDOMNode(this.rootComponent);

			if (node && node.firstChild && node.firstChild.nextSibling && node.lastChild) {
				const toolboxInput = node.firstChild.nextSibling.firstChild as HTMLInputElement;
				const autocompleteInput = node.lastChild.firstChild as HTMLInputElement;

				if (toolboxInput && autocompleteInput) {
					toolboxInput.addEventListener('input', () => {
						autocompleteInput.value = toolboxInput.value;
						autocompleteInput.dispatchEvent(new Event('input', { bubbles: true }))
					});
					toolboxInput.addEventListener('blur', () => {
						autocompleteInput.dispatchEvent(new Event('blur', { bubbles: true }));
					});
					toolboxInput.addEventListener('focus', () => {
						autocompleteInput.dispatchEvent(new Event('input', { bubbles: true }));
					});
					toolboxInput.addEventListener('keydown', (e: any) => {
						const { keyCode } = e;

						if ([Key.Enter, Key.Escape, Key.UpArrow, Key.DownArrow].includes(keyCode)) {
							e.preventDefault();
							autocompleteInput.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true /*, keyCode*/ }));
						}
					});
				}
			}
		}
	}

	renderAutocompleteItem = ({ formattedSuggestion: { mainText, secondaryText } }: any) => (
		<div>
			<strong>{mainText}</strong> <small className='text-muted'>{secondaryText}</small>
		</div>
	);

	private rootComponent: HTMLDivElement | null = null;

	render() {
		const { location, geoError, geoAvailable, setLocation, setCurrentLocation } = this.props;

		return (
			<div className={classes.geoLocation} ref={c => this.rootComponent = c}>
				<Input
					className={classes.input}
					label='Location of Incident'
					onChange={setLocation}
					value={location}
					error={geoError}
				/>
				{
					geoAvailable &&
					<Button raised={true} primary={true} icon='near_me' onClick={setCurrentLocation} />
				}
			</div>
		)
	}
}