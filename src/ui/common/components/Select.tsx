import * as React from 'react';

const classes = require('./Select.css');

export interface SelectOptions {
	label: string;
	value: string;
}
export interface SelectProps {
	label?: string;
	disabled?: boolean;
	options: (string | SelectOptions)[];
	value?: string | null;
	onChange: (s: string) => void;
}

export const Select = ({ disabled, options, value, onChange, label }: SelectProps) => (
	<div className={classes.select}>
		<label>
			{label}
			<select
				disabled={disabled}
				value={value || undefined}
				onChange={(e: any) => onChange(e.target.value)}
			>
				<option />
				{
					options.map((o: string | SelectOptions) => typeof o === 'string'
						? <option key={o}>{o}</option>
						: <option key={o.value} value={o.value}>{o.label}</option>
					)
				}
			</select>
		</label>
	</div>
);
