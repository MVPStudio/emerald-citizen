import { observable, action, computed, observe, autorun } from 'mobx';
import { uiApiClient } from 'ui/common/uiApiClient';
import { CreateReportRequest, CreatePersonRequest, PersonCategory, CreateVehicleRequest } from 'shared/ApiClient';
import { RouterStore } from 'ui/routing/RouterStore';
import { NewReportFormProps } from './NewReportForm';
import { NewPersonFormProps } from './new-person/NewPersonForm';
import { GeoLocationComponentProps } from './geolocation/GeoLocationComponent';
import { StorageFactory } from '../common/storageFactory';
import { NewVehicleFormProps } from './new-vehicle/NewVehicleForm';
import { State } from 'router5';

const { geocodeByAddress } = require('react-places-autocomplete');

export class NewReportFormStore {

	public static getInstance() {
		return this._instance || (this._instance = new NewReportFormStore());
	}

	private static _instance: NewReportFormStore;

	constructor(
		private apiClient = uiApiClient,
		private routerStore = RouterStore.getInstance(),
		private geolocation = window.navigator.geolocation,
		private newReportStorage = StorageFactory.create<Partial<CreateReportRequest>>('newReport'),
		private newVehicleStorage = StorageFactory.create<{ person: Partial<CreateVehicleRequest>, index: string }>('newVehicle'),
		private newPersonStorage = StorageFactory.create<{ person: Partial<CreatePersonRequest>, index: string }>('newPerson')
	) {
		autorun(() => {
			if (this.routerStore.route != null) {
				const routeName = this.routerStore.route.name;
				const routeId = this.routerStore.route.params.id;

				if (routeName === 'newPerson') {
					// get the last person edited
					const { person, index } = newPersonStorage.get();

					if (routeId === index) {
						this.person = person;
					} else {
						// we landed on a new page, drop the old edits and start editing this person
						// this will be called if the route is 'new' or a non integer value and default to an empy object
						this.person = (this.report.get().people || [])[parseInt(routeId, 10)] || {};
						newPersonStorage.set({ person: this.person, index: routeId });
					}
				}
			}
		});
	}

	/**
	 * Components Props
	 */
	@computed
	public get newReportFormProps(): NewReportFormProps {
		return {
			report: this.report.get(),
			fileUrls: this.fileUrls,
			updateReport: this.updateReport,
			saveReport: this.saveReport,
			resetReport: this.resetReport,
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
			location: this.report.get().location,
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
			resetPerson: this.resetPerson,
			allowSavePerson: this.allowSavePerson,
			personIndex: this.personIndex
		};
	}

	@computed
	public get newVehicleFormProps(): NewVehicleFormProps {
		return {
			vehicle: this.vehicle,
			updateVehicle: this.updateVehicle,
			saveVehicle: this.saveVehicle,
			resetVehicle: this.resetVehicle,
			allowSaveVehicle: this.allowSaveVehicle
		};
	}

	/**
	 * Report State
	 */
	private report = observable.box<Partial<CreateReportRequest>>(this.newReportStorage.get());

	@action.bound
	private updateReport(update: Partial<CreateReportRequest>) {
		this.report.set({ ...this.report, ...update });
		this.newReportStorage.set(this.report.get());
	}

	@action.bound
	private resetReport() {
		this.report.set({});
		this.fileUrls = [];
		this.newReportStorage.clear();
		this.newPersonStorage.clear();
		this.newVehicleStorage.clear();
	}

	@action.bound
	private async saveReport() {
		await this.apiClient.reports.create({
			...this.report,
			user_id: 1,
			date: this.report.get().date || this.apiClient.now()
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
		this.person = (this.report.get().people || [])[id] || {};
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
			files: (this.report.get().files || []).concat({ filename })
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
	private person: Partial<CreatePersonRequest>;

	@computed
	private get personIndex() {
		const personIndex = this.routerStore.route && this.routerStore.route.params.id;
		const people = this.report.get().people;

		if (personIndex != null && people != null) {
			const person = people[personIndex];

			if (person != null) {
				let personIndexInCategory = 1;

				// search through each person in the same category until we find the person we are editing 
				// 	to find what the persons index is in that category
				people.forEach((p, idx) => {
					if (idx !== personIndex && p.category === person.category) {
						personIndexInCategory++;
					}
				});

				return personIndexInCategory;
			}
		}

		return undefined;
	}

	@action.bound
	private updatePerson(update: Partial<CreatePersonRequest>) {
		this.person = { ...this.person, ...update };
		this.newPersonStorage.set({ person: this.person, });
	}

	@action.bound
	private async savePerson() {
		const person = this.person as CreatePersonRequest;
		const people = this.report.get().people || [];
		const index: string = this.routerStore.route && this.routerStore.route.params.id;

		if (index === 'new') {
			people.push(person);
		} else {
			people[parseInt(index, 10)] = person;
		}

		this.updateReport({ people });

		this.resetPerson();
		this.routerStore.router.navigate('newReport')
	}

	@action.bound
	private resetPerson() {
		this.person = {};
		this.newPersonStorage.clear();
	}

	@computed
	private get allowSavePerson() {
		return Object.values(this.person).filter(item => item != null).length > 0;
	}

	/**
	 * New Vehicle Form State
	 */
	@observable.ref
	private vehicle: Partial<CreateVehicleRequest> = this.newVehicleStorage.get();

	@computed
	private get allowSaveVehicle() {
		return Object.values(this.vehicle).filter(item => item != null).length > 0;
	}

	@action.bound
	private updateVehicle(update: Partial<CreateVehicleRequest>) {
		this.vehicle = { ...this.vehicle, ...update };
		this.newVehicleStorage.set(this.vehicle);
	}

	@action.bound
	private async saveVehicle() {
		const vehicle = this.vehicle as CreateVehicleRequest;
		const vehicles = this.report.get().vehicles || [];
		const index: string = this.routerStore.route && this.routerStore.route.params.id;

		if (index === 'new') {
			vehicles.push(vehicle);
		} else {
			vehicles[parseInt(index, 10)] = vehicle;
		}

		this.updateReport({ vehicles });
		this.resetVehicle();
		this.routerStore.router.navigate('newReport');
	}

	@action.bound
	private resetVehicle() {
		this.vehicle = {};
		this.newVehicleStorage.clear();
	}

	@action.bound
	private navigateToNewVehicleForm() {
		this.routerStore.router.navigate('newVehicle', { id: 'new' });
	}

	@action.bound
	private navigateToEditVehicleForm(id: number) {
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

		this.report.set({ ...this.report, geo_latitude: lat, geo_longitude: lng, location });
	}

	private readonly GEOLOCATION_ERROR: ReadonlyArray<string> = [
		'',
		'Please allow location access from your browser settings',
		'Position unvailable due to error, please try again',
		'Position timed out, please try again'
	];
}