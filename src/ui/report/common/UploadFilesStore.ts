import { observable, action, computed } from 'mobx';
import { StorageFactory } from './storageFactory';
import { uiApiClient } from 'ui/common/uiApiClient';

export class UploadFilesStore {
	constructor(
		private localStorageKey: string,
		private apiClient = uiApiClient
	) { }

	// this is two separate arrays to be backwards compatible
	//  originally we only stored the file urls
	private fileUrlsStorage = StorageFactory.create<string[]>(this.localStorageKey);
	private fileNamesStorage = StorageFactory.create<string[]>(`${this.localStorageKey}-filenames`);

	public fileUrls = computed(() => this.fileUrlsStorage.value.get() || []);
	public fileNames = computed(() => this.fileNamesStorage.value.get() || []);

	public readonly fileUploading = observable.box(false);

	public reset = action(() => {
		this.fileUrlsStorage.clear();
		this.fileNamesStorage.clear()
	});

	public uploadFile = action(async (file: File) => {
		this.fileUploading.set(true);

		try {
			const { getUrl, filename } = await this.apiClient.media.uploadFile(file);
			this.updateFiles(getUrl, filename);
			return filename;
		} catch (e) {
			console.error(e); // tslint:disable-line:no-console
			this.fileUploading.set(false);
		}

		return null;
	});

	private updateFiles = action((fileUrl: string, filename: string) => {
		this.fileUrlsStorage.set([...this.fileUrls.get(), fileUrl]);
		this.fileNamesStorage.set([...this.fileNames.get(), filename]);
		this.fileUploading.set(false);
	});

	public readonly removeFile = action((fileIndex: number) => {
		const updatedFileUrls = Array.from(this.fileUrls.get());
		updatedFileUrls.splice(fileIndex, 1);
		this.fileUrlsStorage.set(updatedFileUrls);

		const updatedFileNames = Array.from(this.fileNames.get());
		updatedFileNames.splice(fileIndex, 1);
		this.fileNamesStorage.set(updatedFileNames);
	});
}
