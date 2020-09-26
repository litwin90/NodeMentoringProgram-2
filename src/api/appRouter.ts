import { Router } from 'express';

import { groupRouter, userGroupRouter, userRoute } from './routers';

export const appRouter = () => {
    const app = Router();

    userRoute(app);
    groupRouter(app);
    userGroupRouter(app);

    return app;
};
