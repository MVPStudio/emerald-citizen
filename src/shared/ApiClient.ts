import { AxiosInstance } from 'axios';
import { PresignedPost } from 'aws-sdk/clients/s3';

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
	}

	public readonly users = {
		findPage: (page?: number) => this.client.get<User[]>(this.usersUrl, { params: { page } }),
		findById: (id: number) => this.client.get<User | null>(`${this.usersUrl}/${id}`),
		create: (req: CreateUserRequest) => this.client.post<User>(this.usersUrl, req),
		update: (req: Partial<User> & HasId & { password?: string }) => this.client.patch<User>(`${this.usersUrl}/${req.id}`, req),
		delete: (id: number) => this.client.delete(`${this.usersUrl}/${id}`)
	}

	public readonly reports = {
		findSortedPage: (page?: number) => this.client.get<ReportPage[]>(this.reportsUrl, { params: { page } }),
		findById: (id: number) => this.client.get<ReportDetails | null>(`${this.reportsUrl}/${id}`),
		create: (req: CreateReportRequest) => this.client.post<ReportDetails>(this.reportsUrl, req),
		addAddendum: (id: number, text: string) => this.client.post<ReportDetails>(`${this.reportsUrl}/${id}/addendum`, { text }),
		delete: (id: number) => this.client.delete(`${this.reportsUrl}/${id}`),
		toggleInteresting: (id: number) => this.client.post(`${this.reportsUrl}/${id}/toggle_interesting`),
		toggleValidated: (id: number) => this.client.post(`${this.reportsUrl}/${id}/toggle_validated`)
	}

	public readonly media = {
		getSignedUpload: () => this.client.get<MediaSignedUpload>(`${this.mediaUrl}/signed_upload`),
		uploadFileToS3: (url: string, fields: Record<string, string>, file: File) => {
			const data = new FormData();

			Object.entries(fields).forEach(([key, value]) => data.append(key, value));
			data.append('file', file);

			this.client.post<void>(url, data);
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
}

export interface ReportDetails extends Report {
	people: Person[];
	vehicles: Vehicle[];
	addendums: ReportAddendum[];
	files: ReportFile[];
	user: User;
}

export interface ReportPage extends Report {
	last_addendum_dt_tm: Date | string;
	sort_dt_tm: Date | string;
}

export interface CreateVehicleRequest {
	make: string | null;
	model: string | null;
	color: string | null;
	license_plate: string | null;
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

export interface CreatePersonRequest {
	name: string | null;
	age: string | null;
	height: string | null;
	weight: string | null;
	hair_color: string | null;
	hair_length: string | null;
	eye_color: string | null;
	skin_color: string | null;
	sex: PersonSex | null;
	details: string | null;
	category: PersonCategory;
}

export interface Person extends CreatePersonRequest, Timestamped {
	id: number;
	report_id: number;
}

export interface CreateReportAddendumRequest {
	report_id: number;
	text: string;
}

export interface ReportAddendum extends CreateReportAddendumRequest, Timestamped {
	id: number;
}

export interface MediaSignedUpload {
	uploadData: PresignedPost
	getUrl: string;
}

export interface CreateReportFileRequest {
	filename: string;
}

export interface ReportFile extends CreateReportFileRequest, Timestamped {
	id: number;
	url: string;
}