import * as express from 'express';

import { appRouter } from '../api';

export const expressLoader = ({ app }: { app: express.Application }) => {
    app.get('/status', (req, res) => {
        res.status(200).end();
    });

    app.use(express.json());

    app.use(appRouter());
};
