import { observable, action, computed, IComputedValue, IObservableValue } from 'mobx';
import { uiApiClient } from 'ui/common/uiApiClient';
import { CreateReportRequest, CreatePersonRequest, PersonCategory, CreateVehicleRequest } from 'shared/ApiClient';
import { RouterStore } from 'ui/routing/RouterStore';
import { NewReportFormProps } from './NewReportForm';
import { NewPersonFormProps } from './new-person/NewPersonForm';
import { GeoLocationProps } from './geolocation/GeoLocation';
import { StorageFactory } from '../common/storageFactory';
import { NewVehicleFormProps } from './new-vehicle/NewVehicleForm';
const debounce = require('lodash.debounce');

export class NewReportFormStore {

	public static getInstance() {
		return this._instance || (this._instance = new NewReportFormStore());
	}

	private static _instance: NewReportFormStore;

	constructor(
		private apiClient = uiApiClient,
		private routerStore = RouterStore.getInstance(),
		private geolocation = window.navigator.geolocation,
		private newReportStorage = StorageFactory.create<Partial<CreateReportRequest>>('newReport', {}),
		private fileUrlsStorage = StorageFactory.create<string[]>('fileUrls', [])
	) { }

	/**
	 * Components Props
	 */
	public newReportFormProps: IComputedValue<NewReportFormProps> = computed(() => ({
		report: this.report.get(),
		fileUrls: this.fileUrls,
		updateReport: this.updateReport,
		saveReport: this.saveReport,
		resetReport: this.resetReport,
		navigateToNewPersonForm: this.navigateToNewPersonForm,
		navigateToEditPersonForm: this.navigateToEditPersonForm,
		navigateToNewVehicleForm: this.navigateToNewVehicleForm,
		navigateToEditVehicleForm: this.navigateToEditVehicleForm,
		uploadFile: this.uploadFile,
		fileUploading: this.fileUploading.get(),
		removeFile: this.removeFile
	}));

	public geoLocationProps: IComputedValue<GeoLocationProps> = computed(() => ({
		geoAvailable: this.geoAvailable,
		geoError: this.geoError.get(),
		location: this.report.get().location,
		locationSuggestions: this.locationSuggestions.get(),
		setCurrentLocation: this.setCurrentLocation,
		setLocation: this.setLocation,
		clearLocationSuggestions: this.clearLocationSuggestions
	}));

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

	private updateReport = (update: Partial<CreateReportRequest>) => {
		const updatedReport = { ...this.report.get(), ...update };
		this.report.set(updatedReport);
		this.newReportStorage.set(updatedReport);
	}

	@action.bound
	private resetReport = () => {
		this.report.set({});
		this.newReportStorage.clear();
		this.fileUrls = [];
		this.fileUrlsStorage.clear();
		window.scrollTo(0, 0);
	}

	@action.bound
	private async saveReport() {
		await this.apiClient.reports.create({
			...this.report.get(),
			user_id: 1,
			date: this.report.get().date || this.apiClient.now()
		});

		this.resetReport();
		this.routerStore.router.navigate('newReportSuccess');
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
	private fileUrls: string[] = this.fileUrlsStorage.get();

	private fileUploading = observable.box(false);

	private uploadFile = action(async (file: File) => {
		this.fileUploading.set(true);

		try {
			const { filename, putUrl, getUrl } = (await this.apiClient.media.getSignedUpload()).data;
			await this.apiClient.media.uploadFile(putUrl, file);

			this.updateFiles(filename, getUrl);
		} catch (e) {
			console.error(e); // tslint:disable-line:no-console
			this.fileUploading.set(false);
		}
	});

	private updateFiles = action((filename: string, fileUrl: string) => {
		this.updateReport({
			files: (this.report.get().files || []).concat({ filename })
		});

		// wait a second to make sure upload finished
		setTimeout(
			() => {
				const updatedFileUrls = this.fileUrls.concat(fileUrl);
				this.fileUrls = updatedFileUrls;
				this.fileUrlsStorage.set(updatedFileUrls);
				this.fileUploading.set(false);
			},
			1000
		);
	});

	private removeFile = action((fileIndex: number) => {
		const updatedFileUrls = Array.from(this.fileUrls);

		updatedFileUrls.splice(fileIndex, 1);
		this.fileUrls = updatedFileUrls;
		this.fileUrlsStorage.set(updatedFileUrls);
	});

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
	private geoError: IObservableValue<string | null> = observable.box(null);
	private locationSuggestions: IObservableValue<string[]> = observable.box([]);

	private readonly geoAvailable = this.geolocation != null;
	private readonly googleGeocoder = new google.maps.Geocoder();
	private readonly googleAutocompleteService = new google.maps.places.AutocompleteService();

	private readonly setCurrentLocation = () => {
		this.geolocation.getCurrentPosition(
			({ coords }) => {
				const { latitude, longitude } = coords;
				let location = `(${latitude}, ${longitude})`;

				this.googleGeocoder.geocode(
					{ location: { lat: latitude, lng: longitude } },
					(results: any[], status: string) => {
						if (status === 'OK' && results[0]) {
							location = results[0].formatted_address;
						}

						this.setReportLocation(null, { lat: latitude, lng: longitude }, location);
					});
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

	private readonly setLocation = (location: string, wasSuggested?: boolean) => {
		this.setReportLocation(null, undefined, location); // update input value immediately
		this.reverseGeocodeLocation(location); // debounce and lazily update lat/lng
		if (wasSuggested) {
			this.clearLocationSuggestions();
		} else {
			this.loadLocationSuggestions(location); // debounce and lazily load suggestions
		}
	};

	private clearLocationSuggestions = () => {
		this.locationSuggestions.set([]);
	};

	private loadLocationSuggestions = debounce(
		(location: string) => {
			this.googleAutocompleteService.getQueryPredictions({ input: location }, (results: any[] = [], status: string) => {
				if (status === 'OK') {
					this.locationSuggestions.set(results.map(r => r.description));
				}
			});
		},
		1000,
		{ leading: false, trailing: true }
	);

	private reverseGeocodeLocation = debounce(
		(location: string) => {
			this.googleGeocoder.geocode({ 'address': location }, (results: any[] = [], status: string) => {
				if (status === 'OK' && results[0]) {
					const { geometry } = results[0];
					this.setReportLocation(
						null,
						{
							lat: geometry.location.lat(),
							lng: geometry.location.lng()
						},
						this.report.get().location
					);
				}
			});
		},
		2000,
		{ leading: false, trailing: true }
	);

	private setReportLocation(err: string | null, coords?: Coordinates, location?: string) {
		const { lat, lng }: Coordinates = coords || {};

		this.geoError.set(err);
		this.updateReport({ geo_latitude: lat, geo_longitude: lng, location });
	}

	private readonly GEOLOCATION_ERROR: ReadonlyArray<string> = [
		'',
		'Please allow location access from your browser settings',
		'Position unvailable due to error, please try again',
		'Position timed out, please try again'
	];
}

type Coordinates = { lat?: number, lng?: number };