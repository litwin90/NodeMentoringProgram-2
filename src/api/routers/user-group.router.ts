import * as express from 'express';
import Container from 'typedi';

import { UserGroupController } from '../controllers';
import { UserGroupsMiddlewareService } from '../middlewares';

const route = express.Router();

export const userGroupRouter = (app: express.Router) => {
    app.use('/user-group', route);

    const { addUsersToGroup } = Container.get(UserGroupController);
    const { validateAddUserToGroupRequest } = Container.get(UserGroupsMiddlewareService);

    route.post('/add-users-to-group', validateAddUserToGroupRequest, addUsersToGroup);
};
