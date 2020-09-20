import { ModelCtor, Op } from 'sequelize';
import { Inject, Service } from 'typedi';

import { Config } from '../config';
import { CreateActionUser, UpdateActionUser } from '../interfaces';
import { IUserInstance } from '../models';

@Service()
export class UserService {
    constructor(@Inject(Config.injectionToken.userModel) private userModel: ModelCtor<IUserInstance>) {}

    async getUserById(id: string) {
        return this.userModel.findOne({ where: { id } });
    }

    async createUser(createActionUser: CreateActionUser) {
        return this.userModel.create({
            ...createActionUser,
        });
    }

    async updateUser(userId: string, updateActionUser: UpdateActionUser) {
        return this.userModel.update(
            {
                ...updateActionUser,
            },
            {
                where: {
                    id: userId,
                },
            },
        );
    }

    async deleteUser(userId: string) {
        return this.userModel.destroy({
            where: {
                id: userId,
            },
        });
    }

    async autoSuggest(loginSubstring: string, limit: number) {
        return this.userModel.findAll({
            where: {
                login: {
                    [Op.substring]: loginSubstring,
                },
            },
            limit,
        });
    }
}
