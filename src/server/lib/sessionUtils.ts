import { get } from 'lodash';
import { Request } from 'express';

export const getSessionUserId = (req: Request): number => get(req, 'session.userId', -1);
