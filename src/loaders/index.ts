import express from 'express';

import { expressLoader } from './express';
import { sequelizeLoader } from './sequelize';

export const appLoaders = async ({ app }: { app: express.Application }) => {
    await sequelizeLoader({ forceSync: false });
    await expressLoader({ app });
};
