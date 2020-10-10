import cls from 'cls-hooked';
import { Sequelize } from 'sequelize';
import Container from 'typedi';

import { Config } from '../config';
import { sequelizeLogger } from '../logger';
import { getGroupModel, getUserGroupModel, getUserModel } from '../models';
import { getRefreshTokenModel } from '../models/refreshToken';

const namespace = cls.createNamespace(Config.database.namespace);

export const sequelizeLoader = async ({ forceSync }: { forceSync: boolean }) => {
    try {
        Sequelize.useCLS(namespace);

        Sequelize.afterConnect(() => {
            sequelizeLogger.info('Connection to database has been established successfully.');
        });
        Sequelize.afterDisconnect(() => {
            sequelizeLogger.info('Connection to database has been close.');
        });
        const sequelize = new Sequelize({
            host: Config.database.host,
            username: Config.database.username,
            database: Config.database.database,
            port: Config.database.port,
            password: Config.database.password,
            dialect: Config.database.dialect,
            logging: false,
        });

        await sequelize.authenticate();

        Container.set(Config.injectionToken.sequelize, sequelize);

        initModels(sequelize);

        await sequelize.sync({ force: forceSync });
        sequelizeLogger.info('Database is synced with models');
    } catch (error) {
        sequelizeLogger.error('Unable to connect to the database:', error);
    }
};

function initModels(sequelize: Sequelize) {
    const UserModel = getUserModel(sequelize);
    const GroupModel = getGroupModel(sequelize);
    const UserGroupModel = getUserGroupModel(sequelize, UserModel, GroupModel);
    const RefreshTokenModel = getRefreshTokenModel(sequelize);

    UserModel.belongsToMany(GroupModel, { through: UserGroupModel });
    GroupModel.belongsToMany(UserModel, { through: UserGroupModel });

    UserModel.hasMany(RefreshTokenModel, { onDelete: 'CASCADE' });
    RefreshTokenModel.belongsTo(UserModel);

    Container.set(Config.injectionToken.model.group, GroupModel);
    Container.set(Config.injectionToken.model.user, UserModel);
    Container.set(Config.injectionToken.model.refreshToken, RefreshTokenModel);
}
