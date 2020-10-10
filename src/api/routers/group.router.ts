import { Router } from 'express';
import { Container } from 'typedi';

import { GroupController } from '../controllers';
import { GroupMiddlewareService } from '../middlewares';

const groupRoute = Router();

export const groupRouter = (app: Router, appRouteName: string) => {
    app.use(appRouteName, groupRoute);

    const { getGroups, getGroupById, createGroup, updateGroup, deleteGroup } = Container.get(GroupController);
    const { validateCreateActionGroup, validateUpdateActionGroup } = Container.get(GroupMiddlewareService);

    groupRoute.get('/', getGroups);

    groupRoute.get('/:id', getGroupById);

    groupRoute.post('/', validateCreateActionGroup, createGroup);

    groupRoute.patch('/:id', validateUpdateActionGroup, updateGroup);

    groupRoute.delete('/:id', deleteGroup);
};
