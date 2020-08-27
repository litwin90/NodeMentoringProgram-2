import * as express from 'express';
import Container from 'typedi';

import { EntitiesOperationStatus } from '../../services/models';
import { UserGroupService } from '../../services/user-group.service';
import { HTTP_CODES } from '../constants';
import { UserGroupsMiddlewareService } from '../middlewares';

const route = express.Router();

export const userGroupRouter = (app: express.Router) => {
    app.use('/user-group', route);

    const userGroupService = Container.get(UserGroupService);
    const userGroupMiddlewares = Container.get(UserGroupsMiddlewareService);

    route.post('/add-users-to-group', userGroupMiddlewares.validateAddUserToGroupRequest, async (req, res) => {
        try {
            const { groupId, usersIds } = req.body;

            const result = await userGroupService.addUsersToGroup(groupId, usersIds);

            if (result === EntitiesOperationStatus.Failure) {
                res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(
                    `Unable to add users (ids: ${usersIds}) to group (id: ${groupId})`,
                );
                return;
            }
            res.status(HTTP_CODES.OK).send(`Users (ids: ${usersIds}) added to group (id: ${groupId})`);
        } catch (error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(error);
        }
    });
};
