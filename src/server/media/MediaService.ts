import { v1 } from 'uuid';
import { s3Client } from '../lib/awsClients';
import { PresignedPost } from 'aws-sdk/clients/s3';
import { config } from 'server/config';
import { MediaSignedUpload } from 'shared/ApiClient';

export class MediaService {
	public static getInstance() {
		return this._instance || (this._instance = new MediaService());
	}

	private static _instance: MediaService

	constructor(
		private bucket = config.s3Bucket,
		private s3 = s3Client
	) { }

	public getSignedUpload(): Promise<MediaSignedUpload> {
		const key = v1();

		return new Promise<MediaSignedUpload>((resolve, reject) => {
			this.s3.createPresignedPost(
				{
					Bucket: this.bucket,
					Fields: {
						key
					},
					Conditions: [
						['content-length-range', 0, 10000000] // 10 Mb
					]
				},
				(err, uploadData) => {
					if (err) {
						return reject(err)
					}

					this.s3.getSignedUrl('getObject', { Bucket: this.bucket, Key: key }, (err2, getUrl) => {
						if (err2) {
							return reject(err2)
						}

						resolve({ uploadData, getUrl });
					});
				}
			)
		});
	}
}
