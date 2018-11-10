import { MediaService } from './MediaService';
import { Router, Request, Response } from 'express';

export const getMediaRoutes = (mediaService = MediaService.getInstance()) =>
	Router()
		.get('/signed_upload', [
			(_: Request, res: Response) => res.sendPromise(mediaService.getSignedUpload())
		]);