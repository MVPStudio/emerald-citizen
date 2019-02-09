export enum ServiceErrorCode {
	SERVER_ERROR = 'SERVER_ERROR',
	VALIDATION_ERROR = 'VALIDATION_ERROR',
	BAD_REQUEST = 'BAD_REQUEST',
	NOT_FOUND = 'NOT_FOUND',
	AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
	AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR'
}

const codeToStatus = {
	VALIDATION_ERROR: 422,
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
	AUTHENTICATION_ERROR: 403,
	AUTHORIZATION_ERROR: 401
}

export class ServiceError extends Error {
	constructor(
		public readonly message: string,
		public readonly code: ServiceErrorCode,
		public readonly status: number = codeToStatus[code] || 500
	) {
		super(message);
	}
}