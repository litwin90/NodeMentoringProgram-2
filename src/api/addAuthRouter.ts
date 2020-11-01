import { Router } from 'express';

import { authRouter } from './routers';

export enum AppAuthRouteName {
    Auth = '/auth',
}

export const appAuthRouter = () => {
    const app = Router();

    authRouter(app, AppAuthRouteName.Auth);
    return app;
};
