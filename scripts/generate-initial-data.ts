import { Sequelize } from 'sequelize';
import { ModelCtor } from 'sequelize/types';
import Container from 'typedi';

import 'reflect-metadata';

import { Config } from '../src/config';
/* eslint-disable prefer-spread */
import { CreateActionGroup, CreateActionUser, Permission } from '../src/interfaces';
import { sequelizeLoader } from '../src/loaders/sequelize';
import { IGroupInstance, IUserInstance } from '../src/models';
import { UserGroupService } from '../src/services';

const getSequenceTillNumber = (tillNumber: number): number[] => {
    return Array.apply(null, Array(tillNumber)).map((_: number, i: number) => {
        return i + 1;
    });
};

async function generateInitialData() {
    try {
        await sequelizeLoader({ forceSync: true });

        const UserModel = Container.get(Config.injectionToken.userModel) as ModelCtor<IUserInstance>;
        const GroupModel = Container.get(Config.injectionToken.groupModel) as ModelCtor<IGroupInstance>;

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
        const newUsers = await UserModel.bulkCreate(users, { validate: true });

        const groups = getSequenceTillNumber(50).map(
            (index: number): CreateActionGroup => {
                const newGroup: CreateActionGroup = {
                    name: `group${index}`,
                    permissions: [Permission.Delete],
                };
                return newGroup;
            },
        );
        const newGroups = await GroupModel.bulkCreate(groups, { validate: true });

        const userGroupService = Container.get(UserGroupService);

        await Promise.all([
            newGroups.map(({ id }, index) => {
                const usersIds: string[] = [newUsers[index], newUsers[index * 2]].map((user) => user.id);
                return userGroupService.addUsersToGroup(id, usersIds);
            }),
        ]);
    } catch (error) {
        console.log(error);
    } finally {
        const sequelize = Container.get(Config.injectionToken.sequelize) as Sequelize;
        await sequelize.close();
    }
}

generateInitialData();
