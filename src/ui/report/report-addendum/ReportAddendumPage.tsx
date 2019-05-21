import * as React from 'react';
import { MobilePageContainer } from '../../common/components/layouts/MobilePageContainer';
import Card from 'react-toolbox/lib/card';
import { Button } from 'react-toolbox/lib/button';
import { Input } from 'react-toolbox/lib/input';
import { UploadFiles, UploadFilesProps } from '../common/UploadFiles';

const classes = require('./ReportAddendumPage.css');

export interface ReportAddendumPageProps {
	disabled: boolean;
	addendumText: string;
	setAddendumText: (t: string) => void;
	reset: () => void;
	saveAddendum: () => void;
	uploadFilesProps: UploadFilesProps
}

export class ReportAddendumPage extends React.Component<ReportAddendumPageProps> {
	componentDidMount() {
		this.props.reset();
	}

	render() {
		const { addendumText, setAddendumText, uploadFilesProps, disabled } = this.props;

		return (
			<MobilePageContainer className={classes.reportAddendumPage}>
				<Card>
					<form onSubmit={this.onSubmit}>
						{
							// @ts-ignore: autoFocus missing on type def
							<Input
								className={classes.text}
								autoFocus='true'
								type='text'
								label='Addendum'
								multiline={true}
								value={addendumText}
								onChange={setAddendumText}
							/>}
						<UploadFiles {...uploadFilesProps} />
						<Button
							className={classes.submitButton}
							type='submit'
							label='Submit'
							raised={true}
							primary={true}
							disabled={disabled}
						/>
					</form>
				</Card>
			</MobilePageContainer>
		);
	}

	private onSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		this.props.saveAddendum();
	}
}
