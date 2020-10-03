/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as express from 'express';
import { Service } from 'typedi';

import { HttpCode, HttpMessage } from '../constants';

@Service()
export class ErrorHandlingMiddlewareService {
    unhandledErrorsMiddleware(error: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send(HttpMessage.INTERNAL_SERVER_ERROR);
    }
}
