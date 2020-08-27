import { DataTypes, HasManyAddAssociationMixin, Model, Sequelize, UUIDV4 } from 'sequelize';

import { CreateActionGroup, IGroup, Permission } from '../interfaces';
import { IUserInstance } from './user.model';

export interface IGroupInstance extends Model<IGroup, CreateActionGroup>, IGroup {
    addUser: HasManyAddAssociationMixin<IUserInstance, number>;
}

const permissionsValues = Object.keys(Permission).map((key) => Permission[key]);

export const getGroupModel = (sequelize: Sequelize) =>
    sequelize.define<IGroupInstance>(
        'Group',
        {
            id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
            name: { type: DataTypes.STRING, allowNull: false, unique: true },
            permissions: {
                type: DataTypes.ARRAY(DataTypes.ENUM({ values: permissionsValues })),
                values: [...permissionsValues],
                allowNull: false,
            },
        },
        {
            timestamps: false,
        },
    );
