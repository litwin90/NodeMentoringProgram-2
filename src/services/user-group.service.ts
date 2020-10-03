import { Sequelize } from 'sequelize';
import { ModelCtor } from 'sequelize/types';
import { Inject, Service } from 'typedi';

import { Config } from '../config';
import { IGroupInstance, IUserInstance } from '../models';
import { EntitiesOperationStatus } from './models';

@Service()
export class UserGroupService {
    constructor(
        @Inject(Config.injectionToken.model.group) private groupModel: ModelCtor<IGroupInstance>,
        @Inject(Config.injectionToken.model.user) private userModel: ModelCtor<IUserInstance>,
        @Inject(Config.injectionToken.sequelize) private sequelize: Sequelize,
    ) {}

    async addUsersToGroup(groupId: string, usersIds: string[]) {
        try {
            return await this.sequelize.transaction(async () => {
                const group = await this.groupModel.findByPk(groupId);
                if (!group) {
                    return EntitiesOperationStatus.Failure;
                }

                const users = await this.userModel.findAll({
                    where: { id: usersIds },
                });

                await Promise.all(users.map((user) => group.addUser(user)));

                return EntitiesOperationStatus.Success;
            });
        } catch {
            return EntitiesOperationStatus.Failure;
        }
    }
}
