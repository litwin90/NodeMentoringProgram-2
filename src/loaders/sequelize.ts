import { Sequelize } from 'sequelize';
import Container from 'typedi';

import { Config } from '../config';
import { getUserModel } from '../models';

export const sequelizeLoader = async () => {
    const sequelize = new Sequelize({
        host: Config.database.host,
        username: Config.database.username,
        database: Config.database.database,
        port: Config.database.port,
        password: Config.database.password,
        dialect: Config.database.dialect,
        logging: false,
    });

    const UserModel = getUserModel(sequelize);
    Container.set(Config.injectionToken.userModel, UserModel);

    await UserModel.sync();
};
