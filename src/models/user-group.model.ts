import { DataTypes, ModelCtor, Sequelize, UUIDV4 } from 'sequelize';

import { IGroupInstance } from './group.model';
import { IUserInstance } from './user.model';

export const getUserGroupModel = (
    sequelize: Sequelize,
    UserModel: ModelCtor<IUserInstance>,
    GroupModel: ModelCtor<IGroupInstance>,
) =>
    sequelize.define(
        'UserGroup',
        {
            id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
            UserId: {
                type: DataTypes.UUID,
                references: {
                    model: UserModel,
                    key: 'id',
                },
            },
            GroupId: {
                type: DataTypes.UUID,
                references: {
                    model: GroupModel,
                    key: 'id',
                },
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
        },
    );
