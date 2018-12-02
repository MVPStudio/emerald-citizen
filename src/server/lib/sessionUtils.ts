import { get } from 'lodash';
import { Request } from 'express';
import { SanitizedUser } from 'server/user/UserService';

export const getSessionUserId = (req: Request): number => get(req, 'session.user.id', -1);
export const getSessionUser = (req: Request): SanitizedUser => get(req, 'session.user');