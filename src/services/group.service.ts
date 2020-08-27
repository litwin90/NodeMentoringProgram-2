import { ModelCtor } from 'sequelize';
import { Inject, Service } from 'typedi';

import { Config } from '../config';
import { CreateActionGroup, UpdateActionGroup } from '../interfaces';
import { IGroupInstance } from '../models';

@Service()
export class GroupService {
    constructor(@Inject(Config.injectionToken.groupModel) private groupModel: ModelCtor<IGroupInstance>) {}

    async getGroupById(id: string) {
        return this.groupModel.findOne({ where: { id } });
    }

    async getAllGroups() {
        return await this.groupModel.findAll();
    }

    async creatGroup(createActionGroup: CreateActionGroup) {
        return await this.groupModel.create({ ...createActionGroup });
    }

    async updateGroup(groupId: string, updateActionGroup: UpdateActionGroup) {
        return await this.groupModel.update(
            {
                ...updateActionGroup,
            },
            {
                where: {
                    id: groupId,
                },
            },
        );
    }

    async deleteGroup(groupId: string) {
        return await this.groupModel.destroy({
            where: {
                id: groupId,
            },
        });
    }
}
