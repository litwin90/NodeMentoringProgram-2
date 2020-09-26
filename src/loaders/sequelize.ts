import cls from 'cls-hooked';
import { Sequelize } from 'sequelize';
import Container from 'typedi';

import { Config } from '../config';
import { getGroupModel, getUserGroupModel, getUserModel } from '../models';

const namespace = cls.createNamespace(Config.database.namespace);

export const sequelizeLoader = async ({ forceSync }: { forceSync: boolean }) => {
    try {
        Sequelize.useCLS(namespace);

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
        console.log('Connection to database has been established successfully.');

        Container.set(Config.injectionToken.sequelize, sequelize);

        const UserModel = getUserModel(sequelize);
        const GroupModel = getGroupModel(sequelize);
        const UserGroupModel = getUserGroupModel(sequelize, UserModel, GroupModel);

        UserModel.belongsToMany(GroupModel, { through: UserGroupModel });
        GroupModel.belongsToMany(UserModel, { through: UserGroupModel });

        Container.set(Config.injectionToken.groupModel, GroupModel);
        Container.set(Config.injectionToken.userModel, UserModel);

        await sequelize.sync({ force: forceSync });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
