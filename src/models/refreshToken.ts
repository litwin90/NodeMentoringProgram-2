import moment from 'moment';
import { DataTypes, Model, Sequelize, UUIDV4 } from 'sequelize';

import { Config } from '../config';
import { CreateActionRefreshToken, IRefreshToken } from '../interfaces';

export interface IRefreshTokenInstance extends Model<IRefreshToken, CreateActionRefreshToken>, IRefreshToken {}

export const getRefreshTokenModel = (sequelize: Sequelize) =>
    sequelize.define<IRefreshTokenInstance>(
        'RefreshToken',
        {
            id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
            token: { type: DataTypes.UUID, defaultValue: UUIDV4 },
            expires: {
                type: DataTypes.BIGINT,
            },
        },
        {
            timestamps: false,
            hooks: {
                beforeCreate: (tokenModel: Model<IRefreshToken>) => {
                    const expires = moment().add(Config.auth.refreshTokenExpirationDays, 'days').valueOf();
                    tokenModel.set('expires', expires);
                },
                beforeBulkCreate: (tokenModels: Model<IRefreshToken>[]) => {
                    tokenModels.forEach((tokenModel) => {
                        tokenModel.set(
                            'expires',
                            moment().add(Config.auth.refreshTokenExpirationDays, 'days').valueOf(),
                        );
                    });
                },
            },
        },
    );
