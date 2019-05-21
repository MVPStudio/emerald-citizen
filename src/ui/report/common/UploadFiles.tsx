import * as React from 'react';
import Button from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';

const classes = require('./UploadFiles.css');

export interface UploadFilesProps {
	fileUrls: string[];
	uploadFile: (file: File) => void;
	fileUploading: boolean;
	removeFile: (idx: number) => void;
}

export class UploadFiles extends React.Component<UploadFilesProps> {

	render() {
		const { fileUrls, fileUploading } = this.props;

		return (
			<div>
				{fileUrls.map((url, index) => (
					<div className={classes.uploadedFile} key={index}>
						<img src={url} width='500px' />
						<Button
							className={classes.removeFileButton}
							label='Remove'
							raised={true}
							accent={true}
							mini={true}
							onClick={this.removeFileHandler(index)}
						/>
					</div>
				))}
				<div className={classes.fileUploadButton}>
					{
						fileUploading
							? <h3>Uploading...</h3>
							: <h3>Upload A Picture or Video <Input type='file' onChange={this.uploadFileHandler} /></h3>
					}
				</div>
			</div>
		);
	}

	private uploadFileHandler = (_: string, e: any) => {
		this.props.uploadFile(e.target.files[0]);
	}

	private removeFileHandler = (index: number) => () => this.props.removeFile(index);
}
