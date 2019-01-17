import * as React from 'react'
import cx from 'classnames';
import Avatar from 'react-toolbox/lib/avatar';
import Chip from 'react-toolbox/lib/chip';

const classes = require('./ChipList.css');

export interface ChipListProps {
	chips: any[];
	onClick?: (chip: any, index: number) => void;
	color: string;
	icon: string;
	getTitle: (chip: any) => React.ReactElement<void> | React.ReactElement<void>[] | string;
	display: string;
}

export const ChipList = ({ chips, onClick, color, icon, getTitle, display }: ChipListProps) => (
	<div className={cx(classes.chipList, { [classes.clickable]: !!onClick, [classes.displayInline]: display === 'inline' })}>
		{chips.map((chip, idx) =>
			<div key={idx} className={classes.chip}>
				<Chip onClick={onClick && (() => onClick(chip, idx))}>
					<Avatar style={{ backgroundColor: color }} icon={icon} />
					<span>{idx + 1}: {getTitle(chip)}</span>
				</Chip>
			</div>
		)}
	</div>
)