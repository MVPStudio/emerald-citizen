import { observable, action, computed, IComputedValue } from 'mobx';
import { uiApiClient } from 'ui/common/uiApiClient';
import { RouterStore } from '../../routing/RouterStore';
import { ReportAddendumPageProps } from './ReportAddendumPage';
import { UploadFilesStore } from '../common/UploadFilesStore';

export class ReportAddendumStore {

	public static getInstance() {
		return this._instance || (this._instance = new ReportAddendumStore());
	}

	private static _instance: ReportAddendumStore;

	constructor(
		private apiClient = uiApiClient,
		private routerStore = RouterStore.getInstance(),
		private uploadFilesStore = new UploadFilesStore('addendumFiles'),
	) { }

	private loading = observable.box(false);
	private addendumText = observable.box('');
	private addendumFiles = this.uploadFilesStore.fileNames;
	private reportId = computed(() =>
		this.routerStore.route && parseInt(this.routerStore.route.params.id, 10)
	);
	private disabled = computed(() => this.loading.get() ||
		(this.addendumFiles.get().length === 0 && this.addendumText.get().length === 0)
	)

	private setAddendumText = action((text: string = '') => {
		this.addendumText.set(text);
	});

	private saveAddendum = action(async () => {
		const reportId = this.reportId.get();
		const addendumFiles = this.addendumFiles.get();
		const addendumText = this.addendumText.get();

		if (
			reportId != null &&
			(addendumText.length > 0 || addendumFiles.length > 0)
		) {
			this.loading.set(true);
			await this.apiClient.reports.addAddendum(
				reportId,
				addendumText,
				addendumFiles.map(filename => ({ filename }))
			);
			this.uploadFilesStore.reset();
			this.routerStore.router.navigate(
				'report',
				{ id: reportId },
				{ replace: true }
			);
		}
	});

	private uploadFile = action(async (file: File) => {
		await this.uploadFilesStore.uploadFile(file);
	});

	private reset = action(() => {
		this.uploadFilesStore.reset();
	});

	public readonly props: IComputedValue<ReportAddendumPageProps> = computed(() => {
		return {
			disabled: this.disabled.get(),
			addendumText: this.addendumText.get(),
			setAddendumText: this.setAddendumText,
			reset: this.reset,
			saveAddendum: this.saveAddendum,
			uploadFilesProps: {
				uploadFile: this.uploadFile,
				fileUploading: this.uploadFilesStore.fileUploading.get(),
				removeFile: this.uploadFilesStore.removeFile,
				fileUrls: this.uploadFilesStore.fileUrls.get()
			}
		}
	});
}
