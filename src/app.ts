import express from 'express';

import 'reflect-metadata';

import { Config } from './config';
import { appLoaders } from './loaders';

async function startServer() {
    const app: express.Application = express();

    await appLoaders({ app });

    app.listen(Config.port);
}

startServer();
