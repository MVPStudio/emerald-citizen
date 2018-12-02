import { observable, action, computed } from 'mobx';
import { uiApiClient } from 'ui/common/uiApiClient';
import { CreateReportRequest, CreatePersonRequest, PersonCategory, CreateVehicleRequest } from 'shared/ApiClient';
import { RouterStore } from 'ui/routing/RouterStore';
import { NewReportFormProps } from './NewReportForm';
import { NewPersonFormProps } from './new-person/NewPersonFormComponent';
import { GeoLocationComponentProps } from './geolocation/GeoLocationComponent';

const { geocodeByAddress } = require('react-places-autocomplete');

export class NewReportFormStore {

	public static getInstance() {
		return this._instance || (this._instance = new NewReportFormStore());
	}

	private static _instance: NewReportFormStore;

	constructor(
		private apiClient = uiApiClient,
		private routerStore = RouterStore.getInstance(),
		private geolocation = window.navigator.geolocation
	) { }

	/**
	 * Components Props
	 */
	@computed
	public get newReportFormProps(): NewReportFormProps {
		return {
			report: this.report,
			fileUrls: this.fileUrls,
			updateReport: this.updateReport,
			saveReport: this.saveReport,
			navigateToNewPersonForm: this.navigateToNewPersonForm,
			navigateToEditPersonForm: this.navigateToEditPersonForm,
			navigateToNewVehicleForm: this.navigateToNewVehicleForm,
			navigateToEditVehicleForm: this.navigateToEditVehicleForm,
			uploadFile: this.uploadFile
		};
	}

	@computed
	public get geoLocationProps(): GeoLocationComponentProps {
		return {
			geoAvailable: this.geoAvailable,
			geoError: this.geoError,
			location: this.report.location,
			setCurrentLocation: this.setCurrentLocation,
			setLocation: this.setLocation
		}
	}

	@computed
	public get newPersonFormProps(): NewPersonFormProps {
		return {
			person: this.person,
			updatePerson: this.updatePerson,
			savePerson: this.savePerson,
			allowSavePerson: this.allowSavePerson
		};
	}

	@computed
	public get newVehicleFormProps() {
		return {
			vehicle: this.vehicle,
			updateVehicle: this.updateVehicle,
			saveVehicle: this.saveVehicle,
			allowSaveVehicle: this.allowSaveVehicle
		};
	}

	/**
	 * Report State
	 */
	@observable.ref
	private report: Partial<CreateReportRequest> = {};

	@action.bound
	private updateReport(update: Partial<CreateReportRequest>) {
		this.report = { ...this.report, ...update };
	}

	@action.bound
	private resetReport() {
		this.report = {};
		this.fileUrls = [];
	}

	@action.bound
	private async saveReport() {
		await this.apiClient.reports.create({
			...this.report,
			user_id: 1,
			date: this.report.date || this.apiClient.now()
		});

		this.resetReport();
		this.routerStore.router.navigate('newReportSuccess')
	}

	@action.bound
	private navigateToNewPersonForm(category: PersonCategory) {
		this.person = { category };
		this.routerStore.router.navigate('newPerson', { id: 'new' });
	}

	@action.bound
	private navigateToEditPersonForm(id: number) {
		this.person = (this.report.people || [])[id] || {};
		this.routerStore.router.navigate('newPerson', { id });
	}

	/**
	 * Files state
	 */
	@observable.ref
	public fileUrls: string[] = [];

	public uploadFile = async (file: File) => {
		const { uploadData, getUrl } = (await this.apiClient.media.getSignedUpload()).data;
		await this.apiClient.media.uploadFileToS3(uploadData.url, uploadData.fields, file);

		this.updateFiles(uploadData.fields.key, getUrl);
	}

	@action
	private updateFiles(filename: string, fileUrl: string) {
		this.updateReport({
			files: (this.report.files || []).concat({ filename })
		});

		// wait a second to make sure upload finished
		setTimeout(
			() => this.fileUrls = this.fileUrls.concat(fileUrl),
			1000
		);
	}

	/**
	 * New Person Form State
	 */
	@observable.ref
	private person: Partial<CreatePersonRequest> = {};

	@action.bound
	private updatePerson(update: Partial<CreatePersonRequest>) {
		this.person = { ...this.person, ...update };
	}

	@action.bound
	private async savePerson() {
		const person = this.person as CreatePersonRequest;
		const people = this.report.people || [];
		const index: string = this.routerStore.route && this.routerStore.route.params.id;

		if (index === 'new') {
			people.push(person);
		} else {
			people[parseInt(index, 10)] = person;
		}

		this.updateReport({ people });

		this.routerStore.router.navigate('newReport')
	}

	@computed
	private get allowSavePerson() {
		return Object.values(this.person).filter(item => item != null).length > 0;
	}

	/**
	 * New Vehicle Form State
	 */
	@observable.ref
	private vehicle: Partial<CreateVehicleRequest> = {};

	@computed
	private get allowSaveVehicle() {
		return Object.values(this.vehicle).filter(item => item != null).length > 0;
	}

	@action.bound
	private updateVehicle(update: Partial<CreateVehicleRequest>) {
		this.vehicle = { ...this.vehicle, ...update };
	}

	@action.bound
	private async saveVehicle() {
		const vehicle = this.vehicle as CreateVehicleRequest;
		const vehicles = this.report.vehicles || [];
		const index: string = this.routerStore.route && this.routerStore.route.params.id;

		if (index === 'new') {
			vehicles.push(vehicle);
		} else {
			vehicles[parseInt(index, 10)] = vehicle;
		}

		this.updateReport({ vehicles });
		this.routerStore.router.navigate('newReport')
	}

	@action.bound
	private navigateToNewVehicleForm() {
		this.routerStore.router.navigate('newVehicle', { id: 'new' });
	}

	@action.bound
	private navigateToEditVehicleForm(id: number) {
		this.vehicle = (this.report.vehicles || [])[id] || {};
		this.routerStore.router.navigate('newVehicle', { id });
	}

	/**
	 * Geo State
	 */
	@observable.ref
	private geoError: string | null = null;

	private readonly geoAvailable = this.geolocation != null;

	private readonly setCurrentLocation = () => {
		this.geolocation.getCurrentPosition(
			({ coords: { latitude, longitude } }) => {
				this.setReportLocation(null, latitude, longitude);
			},
			({ code }) => {
				this.setReportLocation(this.GEOLOCATION_ERROR[code]);
			},
			{
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			}
		)
	}

	private readonly setLocation = (location: string) => {
		geocodeByAddress(location, (err: string | null, { lat, lng }: { lat: number, lng: number }) => {
			this.setReportLocation(err, lat, lng, location);
		});
	}

	@action
	private setReportLocation(err: string | null, lat?: number, lng?: number, location?: string) {
		this.geoError = err;

		if (this.geoError) {
			return;
		}

		this.report.geo_latitude = lat;
		this.report.geo_longitude = lng;
		this.report.location = location;
	}

	private readonly GEOLOCATION_ERROR: ReadonlyArray<string> = [
		'',
		'Please allow location access from your browser settings',
		'Position unvailable due to error, please try again',
		'Position timed out, please try again'
	];
}