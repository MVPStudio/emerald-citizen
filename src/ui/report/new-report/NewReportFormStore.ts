import { observable, action, computed, IComputedValue, IObservableValue } from 'mobx';
import { uiApiClient } from 'ui/common/uiApiClient';
import { CreateReportRequest, CreatePersonRequest, PersonCategory, CreateVehicleRequest } from 'shared/ApiClient';
import { RouterStore } from 'ui/routing/RouterStore';
import { NewReportFormProps } from './NewReportForm';
import { NewPersonFormProps } from './new-person/NewPersonForm';
import { GeoLocationComponentProps } from './geolocation/GeoLocationComponent';
import { StorageFactory } from '../common/storageFactory';
import { NewVehicleFormProps } from './new-vehicle/NewVehicleForm';

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
		private newReportStorage = StorageFactory.create<Partial<CreateReportRequest>>('newReport')
	) { }

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

	public newPersonFormProps: IComputedValue<NewPersonFormProps> = computed(() => ({
		person: this.editedPerson.get(),
		updatePerson: this.updatePerson,
		savePerson: this.savePerson,
		resetPerson: this.resetPerson,
		allowSavePerson: this.allowSavePerson,
		personIndex: this.personNumberInCategory
	}));

	@computed
	public get newVehicleFormProps(): NewVehicleFormProps {
		return {
			isNew: this.focusedVehicleIsNew.get(),
			vehicle: this.editedVehicle.get(),
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
		this.routerStore.router.navigate('newPerson', { id: 'new', category });
		window.scrollTo(0, 0);
	}

	@action.bound
	private navigateToEditPersonForm(id: number) {
		this.routerStore.router.navigate('newPerson', { id });
		window.scrollTo(0, 0);
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
	 * New/Edit Person Form State
	 */
	private focusedPersonIndex: IComputedValue<number | undefined> = computed(() => {
		if (this.routerStore.route != null) {
			const routeName = this.routerStore.route.name;
			const idParam = this.routerStore.route.params.id;

			if (routeName === 'newPerson' && !this.focusedPersonIsNew.get()) {
				return parseInt(idParam, 10);
			}
		}

		return undefined;
	});

	private focusedPersonIsNew: IComputedValue<boolean> = computed(() => {
		if (this.routerStore.route != null) {
			const routeName = this.routerStore.route.name;
			const idParam = this.routerStore.route.params.id;

			return routeName === 'newPerson' && idParam === 'new';
		}

		return false;
	});

	private newPersonCategory: IComputedValue<PersonCategory> = computed(() => {
		if (this.routerStore.route != null && this.focusedPersonIsNew.get()) {
			const routeName = this.routerStore.route.name;
			const category = this.routerStore.route.params.category;

			if (routeName === 'newPerson' && Object.values(PersonCategory).includes(category)) {
				return category;
			}
		}

		return PersonCategory.victim;
	});

	private focusedPerson: IComputedValue<Partial<CreatePersonRequest> | undefined> = computed(() => {
		if (this.focusedPersonIsNew.get()) {
			return { category: this.newPersonCategory.get() };
		}

		const personIndex = this.focusedPersonIndex.get();

		if (personIndex != null) {
			return (this.report.get().people || [])[personIndex];
		}

		return undefined;
	});

	private focusedPersonUpdates: IObservableValue<Partial<CreatePersonRequest>> = observable.box({});

	private editedPerson: IComputedValue<Partial<CreatePersonRequest>> = computed(() => ({ ...this.focusedPerson.get(), ...this.focusedPersonUpdates.get() }));

	@computed
	private get personNumberInCategory() {
		const personIndex = this.focusedPersonIndex.get();
		const people = this.report.get().people;

		if (personIndex != null && people != null) {
			const person = people[personIndex];

			if (person != null) {
				let personIndexInCategory = 1;

				// search through each person in the same category until we find the person we are editing 
				// 	to find what the persons index is in that category
				people.forEach((p, idx) => {
					if (idx < personIndex && p.category === person.category) {
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
		this.focusedPersonUpdates.set({ ...this.focusedPersonUpdates.get(), ...update });
	}

	private savePerson = action(async () => {
		const person = this.editedPerson.get() as CreatePersonRequest;
		const people = this.report.get().people || [];
		const personIndex = this.focusedPersonIndex.get();

		if (this.focusedPersonIsNew.get()) {
			people.push(person);
		} else if (personIndex != null) {
			people[personIndex] = person;
		}

		this.updateReport({ people });
		this.resetPerson();
		this.routerStore.router.navigate('newReport')
	});

	@action.bound
	private resetPerson() {
		this.focusedPersonUpdates.set({});
	}

	@computed
	private get allowSavePerson() {
		return Object.values(this.focusedPersonUpdates.get()).filter(item => item != null).length > 0;
	}

	/**
	 * New/Edit Vehicle Form State
	 */
	private focusedVehicleIndex: IComputedValue<number | undefined> = computed(() => {
		if (this.routerStore.route != null) {
			const routeName = this.routerStore.route.name;
			const idParam = this.routerStore.route.params.id;

			if (routeName === 'newVehicle' && !this.focusedVehicleIsNew.get()) {
				return parseInt(idParam, 10);
			}
		}

		return undefined;
	});

	private focusedVehicleIsNew: IComputedValue<boolean> = computed(() => {
		if (this.routerStore.route != null) {
			const routeName = this.routerStore.route.name;
			const idParam = this.routerStore.route.params.id;

			return routeName === 'newVehicle' && idParam === 'new';
		}

		return false;
	});

	private focusedVehicle: IComputedValue<Partial<CreateVehicleRequest> | undefined> = computed(() => {
		if (this.focusedVehicleIsNew.get()) {
			return {};
		}

		const vehicleIndex = this.focusedVehicleIndex.get();

		if (vehicleIndex != null) {
			return (this.report.get().vehicles || [])[vehicleIndex];
		}

		return undefined;
	});

	private focusedVehicleUpdates: IObservableValue<Partial<CreateVehicleRequest>> = observable.box({});

	private editedVehicle: IComputedValue<Partial<CreateVehicleRequest>> = computed(() => ({ ...this.focusedVehicle.get(), ...this.focusedVehicleUpdates.get() }));

	@computed
	private get allowSaveVehicle() {
		return Object.values(this.focusedVehicleUpdates).filter(item => item != null).length > 0;
	}

	@action.bound
	private updateVehicle(update: Partial<CreateVehicleRequest>) {
		this.focusedVehicleUpdates.set({ ...this.focusedVehicleUpdates.get(), ...update });
	}

	@action.bound
	private async saveVehicle() {
		const vehicle = this.editedVehicle.get() as CreateVehicleRequest;
		const vehicles = this.report.get().vehicles || [];
		const index = this.focusedVehicleIndex.get();

		if (this.focusedVehicleIsNew.get()) {
			vehicles.push(vehicle);
		} else if (index != null) {
			vehicles[index] = vehicle;
		}

		this.updateReport({ vehicles });
		this.resetVehicle();
		this.routerStore.router.navigate('newReport');
	}

	@action.bound
	private resetVehicle() {
		this.focusedVehicleUpdates.set({});
	}

	@action.bound
	private navigateToNewVehicleForm() {
		this.routerStore.router.navigate('newVehicle', { id: 'new' });
		window.scrollTo(0, 0);
	}

	@action.bound
	private navigateToEditVehicleForm(id: number) {
		this.routerStore.router.navigate('newVehicle', { id });
		window.scrollTo(0, 0);
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