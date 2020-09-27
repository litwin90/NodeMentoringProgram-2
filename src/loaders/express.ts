import * as express from 'express';
import Container from 'typedi';

import { appRouter, ErrorHandlingMiddlewareService } from '../api';

const { unhandledErrorsMiddleware } = Container.get(ErrorHandlingMiddlewareService);

export const expressLoader = ({ app }: { app: express.Application }) => {
    app.get('/status', (req, res) => {
        res.status(200).end();
    });

    app.use(express.json());

    app.use(appRouter());

    app.use(unhandledErrorsMiddleware);
};
