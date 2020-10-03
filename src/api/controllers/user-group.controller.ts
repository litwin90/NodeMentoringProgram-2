import { Request, Response } from 'express';
import { Service } from 'typedi';

import { HandleError, LogRequestData } from '../../decorators';
import { EntitiesOperationStatus, UserGroupService } from '../../services';
import { HttpCode } from '../constants';

@Service()
export class UserGroupController {
    constructor(private userGroupService: UserGroupService) {}

    @LogRequestData()
    @HandleError()
    async addUsersToGroup(req: Request, res: Response) {
        const { groupId, usersIds } = req.body;

        const result = await this.userGroupService.addUsersToGroup(groupId, usersIds);

        if (result === EntitiesOperationStatus.Failure) {
            res.status(HttpCode.INTERNAL_SERVER_ERROR).send(
                `Unable to add users (ids: ${usersIds}) to group (id: ${groupId})`,
            );
            return;
        }
        res.status(HttpCode.OK).send(`Users (ids: ${usersIds}) added to group (id: ${groupId})`);
    }
}
