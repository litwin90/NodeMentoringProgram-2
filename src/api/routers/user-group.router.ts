import { Router } from 'express';
import Container from 'typedi';

import { UserGroupController } from '../controllers';
import { UserGroupsMiddlewareService } from '../middlewares';

const userGroupRoute = Router();

export enum UserGroupRouteName {
    AddUsersToGroup = '/add-users-to-group',
}

export const userGroupRouter = (app: Router, appRouteName: string) => {
    app.use(appRouteName, userGroupRoute);

    const { addUsersToGroup } = Container.get(UserGroupController);
    const { validateAddUserToGroupRequest } = Container.get(UserGroupsMiddlewareService);

    userGroupRoute.post(UserGroupRouteName.AddUsersToGroup, validateAddUserToGroupRequest, addUsersToGroup);
};
