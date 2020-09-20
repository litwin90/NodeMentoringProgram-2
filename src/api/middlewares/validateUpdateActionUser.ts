import Ajv from 'ajv';
import express from 'express';

import UpdateActionUserSchema from '../../schemas/UpdateActionUser.json';
import { HTTP_CODES } from '../constants';

const ajv = new Ajv();

export const isValidUpdateActionUser = ajv.compile(UpdateActionUserSchema);

export const validateUpdateActionUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (isValidUpdateActionUser(req.body)) {
        return next();
    }
    return res.status(HTTP_CODES.BAD_REQUEST).json({ validationErrors: isValidUpdateActionUser.errors });
};
