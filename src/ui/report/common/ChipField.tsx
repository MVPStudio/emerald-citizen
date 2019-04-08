import * as React from 'react';
import Button from 'react-toolbox/lib/button';
import { ChipList } from './ChipList';

const classes = require('./ChipField.css');

interface ChipFieldProps {
	label: string;
	buttonLabel: string;
	icon: string;
	color: string;
	chips: any[];
	onChipClick?: (chip: any, index: number) => void;
	onChipAdd: () => void,
	getTitle: (chip: any) => React.ReactElement<void> | React.ReactElement<void>[] | string;
	onDelete?: (chip: any, index: number) => void;
}

export const ChipField = ({
	label,
	buttonLabel,
	icon,
	color,
	chips,
	onChipClick,
	onChipAdd,
	getTitle,
	onDelete
}: ChipFieldProps) => (
		<div className={classes.chipField}>
			<h3>{label}</h3>
			<ChipList
				chips={chips}
				onClick={onChipClick}
				color={color}
				icon={icon}
				display='block'
				getTitle={getTitle}
				onDelete={onDelete}
			/>
			<div>
				<Button
					className={classes.addButton}
					primary={true}
					type='button'
					icon='add_circle_outline'
					onClick={onChipAdd}
				>
					Add {buttonLabel}
				</Button>
			</div>
		</div>
	);