import {
    DataTypes, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, Model, Sequelize, UUIDV4,
} from 'sequelize';

import { CreateActionUser, IUser } from '../interfaces';
import { IRefreshTokenInstance } from './refreshToken';

export interface IUserInstance extends Model<IUser, CreateActionUser>, IUser {
    createRefreshToken: HasManyCreateAssociationMixin<IRefreshTokenInstance>;
    getRefreshTokens: HasManyGetAssociationsMixin<IRefreshTokenInstance>;
}

export const getUserModel = (sequelize: Sequelize) =>
    sequelize.define<IUserInstance>(
        'User',
        {
            id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
            login: { type: DataTypes.STRING, allowNull: false, unique: true },
            password: { type: DataTypes.STRING, allowNull: false },
            age: { type: DataTypes.INTEGER, allowNull: false },
        },
        {
            paranoid: true,
            timestamps: true,
            createdAt: false,
            updatedAt: false,
            deletedAt: true,
        },
    );
