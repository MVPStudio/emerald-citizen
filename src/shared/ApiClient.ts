import { AxiosInstance } from 'axios';

export class ApiClient {
	constructor(
		private client: AxiosInstance
	) { }

	private rootApiUrl = '/api'
	private authUrl = `${this.rootApiUrl}/auth`;
	private meUrl = `${this.rootApiUrl}/me`;
	private usersUrl = `${this.rootApiUrl}/users`;
	private reportsUrl = `${this.rootApiUrl}/reports`;
	private mediaUrl = `${this.rootApiUrl}/media`;

	public readonly auth = {
		login: (req: LoginRequest) => this.client.post<User>(`${this.authUrl}/login`, req),
		logout: () => this.client.post<User>(`${this.authUrl}/logout`)
	}

	public readonly me = {
		get: () => this.client.get<User | null>(this.meUrl),
		reports: () => this.client.get<ReportDetails[]>(`${this.meUrl}/reports`),
		updatePassword: (password: string) => this.client.post<void>(`${this.meUrl}/update-password`, { password })
	}

	public readonly users = {
		findPage: (page?: number) => this.client.get<User[]>(this.usersUrl, { params: { page } }),
		findById: (id: number) => this.client.get<User | null>(`${this.usersUrl}/${id}`),
		create: (req: CreateUserRequest) => this.client.post<User>(this.usersUrl, req),
		update: (req: Partial<User> & HasId & { password?: string }) => this.client.patch<User>(`${this.usersUrl}/${req.id}`, req),
		delete: (id: number) => this.client.delete(`${this.usersUrl}/${id}`)
	}

	public readonly reports = {
		findSortedPage: (page?: number) => this.client.get<Report[]>(this.reportsUrl, { params: { page } }),
		findById: (id: number) => this.client.get<ReportDetails | null>(`${this.reportsUrl}/${id}`),
		create: (req: CreateReportRequest) => this.client.post<ReportDetails>(this.reportsUrl, req),
		addAddendum: (id: number, text: string, files: CreateReportFileRequest[] = []) => 
			this.client.post<ReportDetails>(`${this.reportsUrl}/${id}/addendum`, { text, files }),
		delete: (id: number) => this.client.delete(`${this.reportsUrl}/${id}`),
		toggleInteresting: (id: number) => this.client.post<ReportDetails>(`${this.reportsUrl}/${id}/toggle_interesting`),
		toggleValidated: (id: number) => this.client.post<ReportDetails>(`${this.reportsUrl}/${id}/toggle_validated`),
		search: (req: SearchReportsRequest) => this.client.post<Report[]>(`${this.reportsUrl}/search`, req),
		searchPeople: (req: SearchPeopleRequest) => this.client.post<Person[]>(`${this.reportsUrl}/search/people`, req),
		searchVehicles: (req: SearchVehiclesRequest) => this.client.post<Vehicle[]>(`${this.reportsUrl}/search/vehicles`, req)
	}

	public readonly media = {
		uploadFile: async (file: File) => {
			const fileData = new FormData();
			fileData.append('file', file);

			const { data } = await this.client.post<MediaSignedUpload>(`${this.mediaUrl}/upload/${file.name}`, fileData);
			return data;
		}
	}

	public now = () => (new Date()).toISOString();
}

export interface Timestamped {
	created_at: Date | string;
	updated: Date | string;
}

export interface HasId {
	id: number;
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface CreateUserRequest {
	username: string;
	password: string;
	role: UserRole;
}

export interface User extends Timestamped {
	id: number;
	is_active: boolean;
	username: string;
	role: UserRole;
}

export enum UserRole {
	admin = 'admin',
	analyst = 'analyst',
	reporter = 'reporter'
}

export interface CreateReportRequest {
	user_id: number;
	date?: string;
	location?: string;
	room_number?: string;
	details?: string;
	geo_latitude?: number;
	geo_longitude?: number;
	people?: CreatePersonRequest[];
	vehicles?: CreateVehicleRequest[];
	files?: CreateReportFileRequest[];
}

export interface Report extends CreateReportRequest, Timestamped {
	id: number;
	marked_interesting: boolean;
	marked_validated: boolean;
	marked_interesting_dt_tm: number;
	marked_validated_dt_tm: number;
	user: User;
}

export interface ReportDetails extends Report {
	people: Person[];
	vehicles: Vehicle[];
	addendums: ReportAddendum[];
	files: ReportFile[];
	user: User;
	marked_interesting_user: User | null;
	marked_validated_user: User | null;
}

export interface SearchReportsRequest {
	location?: string;
	details?: string;
	marked_interesting?: boolean;
	marked_validated?: boolean;
}

export type SearchPeopleRequest = Partial<CreatePersonRequest>;
export type SearchVehiclesRequest = Partial<CreateVehicleRequest>;

export interface CreateVehicleRequest {
	make: string | null;
	model: string | null;
	color: string | null;
	license_plate: string | null;
	details: string | null;
}

export interface Vehicle extends CreateVehicleRequest, Timestamped {
	id: number;
	report_id: number;
}

export enum PersonCategory {
	suspicious_person = 'suspicious_person',
	buyer = 'buyer',
	victim = 'victim'
}

export enum PersonSex {
	male = 'male',
	female = 'female',
	unsure = 'unsure'
}

export enum HairLength {
	bald = 'bald',
	shaved = 'shaved',
	short = 'short',
	medium = 'medium',
	long = 'long'
}

export enum SkinColor {
	pale = 'pale',
	fair = 'fair',
	light_brown = 'light brown',
	dark_brown = 'dark brown',
	black = 'black'
}

export interface CreatePersonRequest {
	name: string | null;
	age: string | null;
	height: string | null;
	weight: string | null;
	hair_color: string | null;
	hair_length: HairLength | null;
	eye_color: string | null;
	skin_color: SkinColor | null;
	sex: PersonSex | null;
	details: string | null;
	category: PersonCategory;
	has_tatoos: boolean | null;
	has_piercings: boolean | null;
}

export interface Person extends CreatePersonRequest, Timestamped {
	id: number;
	report_id: number;
}

export interface CreateReportAddendumRequest {
	report_id: number;
	text: string;
	files?: CreateReportFileRequest[]
}

export interface ReportAddendum extends Timestamped {
	id: number;
	report_id: number;
	text: string;
}

export interface MediaSignedUpload {
	filename: string;
	getUrl: string;
}

export interface CreateReportFileRequest {
	filename: string;
}

export interface ReportFile extends CreateReportFileRequest, Timestamped {
	id: number;
	url: string;
}