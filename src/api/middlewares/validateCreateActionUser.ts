import Ajv from 'ajv';
import express from 'express';

import CreateActionUserSchema from '../../schemas/CreateActionUser.json';
import { HTTP_CODES } from '../constants';

const ajv = new Ajv();

export const isValidCreateActionUser = ajv.compile(CreateActionUserSchema);

export const validateCreateActionUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (isValidCreateActionUser(req.body)) {
        return next();
    }
    return res.status(HTTP_CODES.BAD_REQUEST).json({ validationErrors: isValidCreateActionUser.errors });
};
