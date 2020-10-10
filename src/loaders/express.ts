import cors from 'cors';
import * as express from 'express';
import Container from 'typedi';

import { appAuthRouter, appRouter, ErrorHandlingMiddlewareService } from '../api';
import { AuthMiddlewareService } from '../api/middlewares/auth.middleware';

const { unhandledErrorsMiddleware } = Container.get(ErrorHandlingMiddlewareService);
const { authCheckMiddleware, refreshAccessTokenMiddleware } = Container.get(AuthMiddlewareService);

export const expressLoader = ({ app }: { app: express.Application }) => {
    app.use(cors());

    app.get('/status', (req, res) => {
        res.status(200).end();
    });

    app.use(express.json());

    app.use(appAuthRouter());

    app.use(refreshAccessTokenMiddleware);
    app.use(authCheckMiddleware);

    app.use(appRouter());

    app.use(unhandledErrorsMiddleware);
};
