import express from 'express';
import { Service } from 'typedi';

import { HTTP_CODES } from '../constants';

@Service()
export class UserGroupsMiddlewareService {
    validateAddUserToGroupRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        const { groupId, usersIds } = req.body;

        const validationErrors = [];
        if (!groupId) {
            validationErrors.push('Group id must be specified');
        }
        if (!usersIds || !usersIds.length) {
            validationErrors.push('Users ids must be specified');
        }

        if (validationErrors.length) {
            return res.status(HTTP_CODES.BAD_REQUEST).json({ validationErrors });
        }

        return next();
    }
}
