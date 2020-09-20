import { Router } from 'express';

import { userRoute } from './routers';

export const appRouter = () => {
    const app = Router();

    userRoute(app);

    return app;
};
