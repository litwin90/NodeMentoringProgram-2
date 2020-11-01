import express from 'express';
import { Sequelize } from 'sequelize';
import Container from 'typedi';

import 'reflect-metadata';

import { Config } from './config';
import { appLoaders } from './loaders';
import { commonLogger } from './logger';

async function startServer() {
    try {
        commonLogger.info('Start Application');
        const app: express.Application = express();

        commonLogger.info('Init loaders');
        await appLoaders({ app });
        commonLogger.info('Loaders initiated');

        app.listen(Config.port, Config.host, () => {
            commonLogger.info(`Running server at ${Config.host}:${Config.port}`);
        });
    } catch (error) {
        commonLogger.error(`Unable to start app , error: ${error}`);
    }
}

async function closeServer() {
    try {
        const sequelize = Container.get(Config.injectionToken.sequelize) as Sequelize;

        await sequelize?.close();
        commonLogger.info('App is stopped');
    } catch (error) {
        commonLogger.error(error);
    }
}

function bindProcessEventsHandlers() {
    process.on('exit', async () => {
        await closeServer();
    });
    process.on('SIGINT', async () => {
        await closeServer();
    });
    process.on('uncaughtException', async (error: Error) => {
        commonLogger.error(error);
        await closeServer();
    });
    process.on('unhandledRejection', async (error: Error) => {
        commonLogger.error(error);
        await closeServer();
    });
}

bindProcessEventsHandlers();
startServer();
