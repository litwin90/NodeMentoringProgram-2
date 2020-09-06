import { ModelCtor } from 'sequelize/types';
import Container from 'typedi';

import 'reflect-metadata';

import { Config } from '../src/config';
/* eslint-disable prefer-spread */
import { CreateActionUser } from '../src/interfaces';
import { sequelizeLoader } from '../src/loaders/sequelize';
import { IUserInstance } from '../src/models';

const getSequenceTillNumber = (tillNumber: number): number[] => {
    return Array.apply(null, Array(tillNumber)).map((_: number, i: number) => {
        return i + 1;
    });
};

async function populateUsers() {
    try {
        await sequelizeLoader();

        const UserModel = Container.get(Config.injectionToken.userModel) as ModelCtor<IUserInstance>;
        await UserModel.sync({ force: true });

        const users = getSequenceTillNumber(50).map(
            (index: number): CreateActionUser => ({
                login: `user${index}`,
                password: `PasswordUser${index}`,
                age: 24,
            }),
        );
        await UserModel.bulkCreate(users, { validate: true });
    } catch (error) {
        console.log(error);
    }
}

populateUsers();
