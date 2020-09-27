import * as express from 'express';
import { Container } from 'typedi';

import { GroupController } from '../controllers';
import { GroupMiddlewareService } from '../middlewares';

const route = express.Router();

export const groupRouter = (app: express.Router) => {
    app.use('/group', route);

    const { getGroups, getGroupById, createGroup, updateGroup, deleteGroup } = Container.get(GroupController);
    const { validateCreateActionGroup, validateUpdateActionGroup } = Container.get(GroupMiddlewareService);

    route.get('/', getGroups);

    route.get('/:id', getGroupById);

    route.post('/', validateCreateActionGroup, createGroup);

    route.patch('/:id', validateUpdateActionGroup, updateGroup);

    route.delete('/:id', deleteGroup);
};
