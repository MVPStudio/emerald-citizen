import { MediaService } from './MediaService';
import { Router, Request, Response } from 'express';
import { AuthMiddleware } from 'server/auth/AuthMiddleware';
import { UserRole } from 'shared/ApiClient';
import * as multer from 'multer';

export const getMediaRoutes = (
	mediaService = MediaService.getInstance(),
	authMiddleware = AuthMiddleware.getInstance()
) => {
	const upload = multer({ 
		storage: multer.memoryStorage(), 
		limits: { 
			fileSize: 10 * 1000 * 1000 // 10 MB
		} 
	});

	return Router()
		.post('/upload/:filename', [
			authMiddleware.limitToRoles(UserRole.admin, UserRole.reporter),
			upload.single('file'),
			(req: Request, res: Response) => res.sendPromise(mediaService.upload(req.params.filename, req.file.buffer))
		]);
};