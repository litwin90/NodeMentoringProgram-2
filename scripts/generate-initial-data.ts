import { Sequelize } from 'sequelize';
import { ModelCtor } from 'sequelize/types';
import Container from 'typedi';

import 'reflect-metadata';

import { Config } from '../src/config';
/* eslint-disable prefer-spread */
import { CreateActionGroup, CreateActionUser, Permission } from '../src/interfaces';
import { sequelizeLoader } from '../src/loaders/sequelize';
import { generateDataLogger } from '../src/logger';
import { IGroupInstance, IUserInstance } from '../src/models';
import { UserGroupService } from '../src/services';

const getSequenceTillNumber = (tillNumber: number): number[] => {
    return Array.apply(null, Array(tillNumber)).map((_: number, i: number) => {
        return i + 1;
    });
};

async function generateInitialData() {
    try {
        generateDataLogger.info('Start generating initial data');
        generateDataLogger.info('Start force create collections');
        await sequelizeLoader({ forceSync: true });
        generateDataLogger.info('New collections created');

        const UserModel = Container.get(Config.injectionToken.model.user) as ModelCtor<IUserInstance>;
        const GroupModel = Container.get(Config.injectionToken.model.group) as ModelCtor<IGroupInstance>;

        generateDataLogger.info('Generating new users to insert');
        const users = getSequenceTillNumber(100).map(
            (index: number): CreateActionUser => {
                const newUser: CreateActionUser = {
                    login: `user${index}`,
                    password: `PasswordUser${index}`,
                    age: 24,
                };
                return newUser;
            },
        );

        generateDataLogger.info('Start inserting users');
        const newUsers = await UserModel.bulkCreate(users, { validate: true });
        generateDataLogger.info('New users inserted to DB');

        generateDataLogger.info('Generating new groups to insert');
        const groups = getSequenceTillNumber(50).map(
            (index: number): CreateActionGroup => {
                const newGroup: CreateActionGroup = {
                    name: `group${index}`,
                    permissions: [Permission.Delete],
                };
                return newGroup;
            },
        );
        generateDataLogger.info('Start inserting groups');
        const newGroups = await GroupModel.bulkCreate(groups, { validate: true });
        generateDataLogger.info('New groups inserted to DB');

        const userGroupService = Container.get(UserGroupService);

        generateDataLogger.info('Start creating relations between users amd groups');
        await Promise.all([
            newGroups.map(({ id }, index) => {
                const usersIds: string[] = [newUsers[index], newUsers[index * 2]].map((user) => user.id);
                return userGroupService.addUsersToGroup(id, usersIds);
            }),
        ]);

        generateDataLogger.info('Data is generated');
    } catch (error) {
        generateDataLogger.error(error);
    } finally {
        const sequelize = Container.get(Config.injectionToken.sequelize) as Sequelize;
        await sequelize.close();
        generateDataLogger.info('Sequelize connection closed');
    }
}

generateInitialData();
