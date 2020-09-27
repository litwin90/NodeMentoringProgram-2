import Ajv from 'ajv';
import express from 'express';
import { Service } from 'typedi';

import CreateActionUserSchema from '../../schemas/CreateActionUser.json';
import UpdateActionUserSchema from '../../schemas/UpdateActionUser.json';
import { HttpCode } from '../constants';

const ajv = new Ajv();

export const isValidCreateActionUser = ajv.compile(CreateActionUserSchema);
export const isValidUpdateActionUser = ajv.compile(UpdateActionUserSchema);

@Service()
export class UserMiddlewareService {
    validateCreateActionUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (isValidCreateActionUser(req.body)) {
            return next();
        }
        return res.status(HttpCode.BAD_REQUEST).json({ validationErrors: isValidCreateActionUser.errors });
    }

    validateUpdateActionUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (isValidUpdateActionUser(req.body)) {
            return next();
        }
        return res.status(HttpCode.BAD_REQUEST).json({ validationErrors: isValidUpdateActionUser.errors });
    }
}
