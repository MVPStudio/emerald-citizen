import { v1 } from 'uuid';
import { config } from 'server/config';
import { storageClient } from 'server/lib/gcloudClients';
import { MediaSignedUpload } from 'shared/ApiClient';
import { Storage } from '@google-cloud/storage';
import * as stream from 'stream';

export class MediaService {
	public static getInstance() {
		return this._instance || (this._instance = new MediaService());
	}

	private static _instance: MediaService

	constructor(
		private bucketName: string = config.storageBucket,
		private client: Storage = storageClient
	) { }

	public async upload(filename: string, data: Buffer): Promise<MediaSignedUpload> {
		const key = `${v1()}-${filename}`;

		const bufferStream = new stream.PassThrough();
		bufferStream.end(data);
		const writeStream = this.client.bucket(this.bucketName).file(key).createWriteStream();

		await (new Promise((resolve, reject) => {
			bufferStream.pipe(writeStream)
				.on('finish', resolve)
				.on('error', reject);
		}));

		const [getUrl] = await this.client
			.bucket(this.bucketName)
			.file(key)
			.getSignedUrl({
				action: 'read',
				expires: Date.now() + 1000 * 60 * 60, // 1 hour
			});

		return { getUrl, filename: key };
	}

	public async getSignedUrl(key: string): Promise<string> {
		const [getUrl] = await this.client
			.bucket(this.bucketName)
			.file(key)
			.getSignedUrl({
				action: 'read',
				expires: Date.now() + 1000 * 60 * 10, // 10 minutes
			});

		return getUrl;
	}
}
