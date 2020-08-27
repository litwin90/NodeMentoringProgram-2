import Ajv from 'ajv';
import express from 'express';

import { HTTP_CODES } from '../constants';
import UserSchema from '../schemas/IUser.json';
import PartialUserSchema from '../schemas/PartialUser.json';

const ajv = new Ajv();

export const isValidUser = ajv.compile(UserSchema);
export const isValidPartialUser = ajv.compile(PartialUserSchema);

export const validateUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (isValidUser(req.body)) {
        return next();
    }
    return res.status(HTTP_CODES.BAD_REQUEST).json({ validationErrors: isValidUser.errors });
};
export const validatePartialUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (isValidPartialUser(req.body)) {
        return next();
    }
    return res.status(HTTP_CODES.BAD_REQUEST).json({ validationErrors: isValidUser.errors });
};
