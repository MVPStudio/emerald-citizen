import { v1 } from 'uuid';
import { config } from 'server/config';
import { storageClient } from 'server/lib/gcloudClients';
import { MediaSignedUpload } from 'shared/ApiClient';
import { Storage } from '@google-cloud/storage';

export class MediaService {
	public static getInstance() {
		return this._instance || (this._instance = new MediaService());
	}

	private static _instance: MediaService

	constructor(
		private bucketName: string = config.storageBucket,
		private client: Storage = storageClient
	) { }

	public async getSignedUpload(): Promise<MediaSignedUpload> {
		const filename = v1();

		// Get a signed URL for the file
		const [putUrl] = await this.client
			.bucket(this.bucketName)
			.file(filename)
			.getSignedUrl({
				action: 'write',
				expires: Date.now() + 1000 * 60 * 10, // 10 minutes
			});

		const [getUrl] = await this.client
			.bucket(this.bucketName)
			.file(filename)
			.getSignedUrl({
				action: 'read',
				expires: Date.now() + 1000 * 60 * 60, // 1 hour
			});

		return { putUrl, getUrl, filename };

		// return new Promise<MediaSignedUpload>((resolve, reject) => {
		// 	this.s3.createPresignedPost(
		// 		{
		// 			Bucket: this.bucketName,
		// 			Fields: {
		// 				key
		// 			},
		// 			Conditions: [
		// 				['content-length-range', 0, 10000000] // 10 Mb
		// 			]
		// 		},
		// 		(err, uploadData) => {
		// 			if (err) {
		// 				return reject(err)
		// 			}

		// 			this.getSignedUrl(key)
		// 				.then(getUrl => resolve({ uploadData, getUrl }))
		// 				.catch(reject);
		// 		}
		// 	)
		// });
	}

	public async getSignedUrl(filename: string): Promise<string> {
		const [getUrl] = await this.client
			.bucket(this.bucketName)
			.file(filename)
			.getSignedUrl({
				action: 'read',
				expires: Date.now() + 1000 * 60 * 10, // 10 minutes
			});

		return getUrl;
		// return new Promise((resolve, reject) =>
		// 	this.s3.getSignedUrl('getObject', { Bucket: this.bucketName, Key: filename }, (err, url) => {
		// 		if (err) {
		// 			return reject(err)
		// 		}

		// 		resolve(url);
		// 	})
		// );
	}
}
