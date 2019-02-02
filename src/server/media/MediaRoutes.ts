import { MediaService } from './MediaService';
import { Router, Request, Response } from 'express';
import { AuthMiddleware } from 'server/auth/AuthMiddleware';
import { UserRole } from 'shared/ApiClient';

export const getMediaRoutes = (
	mediaService = MediaService.getInstance(),
	authMiddleware = AuthMiddleware.getInstance()
) =>
	Router()
		.get('/signed_upload', [
			authMiddleware.limitToRoles(UserRole.admin, UserRole.reporter),
			(_: Request, res: Response) => res.sendPromise(mediaService.getSignedUpload())
		]);