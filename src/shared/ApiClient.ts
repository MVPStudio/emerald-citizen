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
		reports: () => this.client.get<Report[]>(`${this.meUrl}/reports`),
	}

	public readonly users = {
		find: () => this.client.get<User[]>(this.usersUrl),
		findById: (id: number) => this.client.get<User | null>(`${this.usersUrl}/${id}`),
		create: (req: CreateUserRequest) => this.client.post<User>(this.usersUrl, req),
		update: (req: Partial<User> & HasId) => this.client.patch<User>(`${this.usersUrl}/${req.id}`, req),
		delete: (id: number) => this.client.delete(`${this.usersUrl}/${id}`)
	}

	public readonly reports = {
		find: () => this.client.get<Report[]>(this.usersUrl),
		findById: (id: number) => this.client.get<Report | null>(`${this.reportsUrl}/${id}`),
		create: (req: CreateReportRequest) => this.client.post<Report>(this.reportsUrl, req),
		addAddendum: (id: number, text: string) => this.client.post<Report>(`${this.reportsUrl}/${id}/addendum`, { text }),
		delete: (id: number) => this.client.delete(`${this.reportsUrl}/${id}`)
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
	created_at: Date;
	updated: Date;
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

export interface User extends CreateUserRequest, Timestamped {
	id: number;
	is_active: boolean;
}

export enum UserRole {
	admin = 'admin',
	analyst = 'analyst',
	reporter = 'reporter'
}

export interface CreateReportRequest {
	user_id: number;
	date: string;
	location?: string;
	room_number?: string;
	details?: string;
	geo_latitude?: number;
	geo_longitude?: number;
	people?: CreatePersonRequest[];
	vehicles?: CreateVehicleRequest[];
	files?: string[];
}

export interface Report extends CreateReportRequest, Timestamped {
	id: number;
	people: Person[];
	vehicles: Vehicle[];
	addendums: ReportAddendum[];
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

export interface CreatePersonRequest {
	name: string | null;
	age: number | null;
	height: string | null;
	weight: string | null;
	hair_color: string | null;
	hair_length: string | null;
	eye_color: string | null;
	skin_color: string | null;
	sex: string | null;
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