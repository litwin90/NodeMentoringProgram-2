import Ajv from 'ajv';
import express from 'express';
import { Service } from 'typedi';

import CreateActionGroupSchema from '../../schemas/CreateActionGroup.json';
import UpdateActionGroupSchema from '../../schemas/UpdateActionGroup.json';
import { HttpCode } from '../constants';

const ajv = new Ajv();

export const isValidCreateActionGroup = ajv.compile(CreateActionGroupSchema);
export const isValidUpdateActionGroup = ajv.compile(UpdateActionGroupSchema);

@Service()
export class GroupMiddlewareService {
    validateCreateActionGroup(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (isValidCreateActionGroup(req.body)) {
            return next();
        }
        return res.status(HttpCode.BAD_REQUEST).json({ validationErrors: isValidCreateActionGroup.errors });
    }

    validateUpdateActionGroup(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (isValidUpdateActionGroup(req.body)) {
            return next();
        }
        return res.status(HttpCode.BAD_REQUEST).json({ validationErrors: isValidUpdateActionGroup.errors });
    }
}
