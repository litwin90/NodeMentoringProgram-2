import { ModelCtor, Op } from 'sequelize';
import { Inject, Service } from 'typedi';

import { Config } from '../config';
import { CreateActionUser, UpdateActionUser } from '../interfaces';
import { IUserInstance } from '../models';

@Service()
export class UserService {
    constructor(@Inject(Config.injectionToken.userModel) private userModel: ModelCtor<IUserInstance>) {}

    async getUserById(id: string) {
        return await this.userModel.findOne({ where: { id } });
    }

    async createUser(createActionUser: CreateActionUser) {
        return await this.userModel.create({
            ...createActionUser,
        });
    }

    async updateUser(userId: string, updateActionUser: UpdateActionUser) {
        return await this.userModel.update(
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
        return await this.userModel.destroy({
            where: {
                id: userId,
            },
        });
    }

    async autoSuggest(loginSubstring: string, limit: number) {
        return await this.userModel.findAll({
            where: {
                login: {
                    [Op.substring]: loginSubstring,
                },
            },
            limit,
        });
    }
}
