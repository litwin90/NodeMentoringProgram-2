import { Router } from 'express';

import { groupRouter, userGroupRouter, userRouter } from './routers';

export enum AppRouteName {
    User = '/user',
    Group = '/group',
    UserGroup = '/user-group',
}

export const appRouter = () => {
    const app = Router();

    userRouter(app, AppRouteName.User);
    groupRouter(app, AppRouteName.Group);
    userGroupRouter(app, AppRouteName.UserGroup);

    return app;
};
