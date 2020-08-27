import express from 'express';
import { Sequelize } from 'sequelize';
import Container from 'typedi';

import 'reflect-metadata';

import { Config } from './config';
import { appLoaders } from './loaders';

async function startServer() {
    try {
        const app: express.Application = express();

        await appLoaders({ app });

        app.listen(Config.port);
    } catch (error) {
        console.log(`Unable to start app , error: ${error}`);
    }
}

async function closeServer() {
    try {
        const sequelize = Container.get(Config.injectionToken.sequelize) as Sequelize;

        await sequelize.close();
    } catch (error) {
        console.log(error);
    }
}

function bindProcessEventsHandlers() {
    process.on('exit', async () => {
        await closeServer();
    });
    process.on('SIGINT', async () => {
        console.log('SIGINT');
        await closeServer();
    });
    process.on('uncaughtException', async () => {
        await closeServer();
    });
    process.on('unhandledRejection', async () => {
        await closeServer();
    });
}

bindProcessEventsHandlers();
startServer();
