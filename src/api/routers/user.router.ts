import * as express from 'express';
import { Container } from 'typedi';

import { UserController } from '../controllers';
import { UserMiddlewareService } from '../middlewares';

const route = express.Router();

export const userRoute = (app: express.Router) => {
    app.use('/user', route);

    const { getUserById, createUser, updateUser, deleteUser, autoSuggestUsers } = Container.get(UserController);
    const { validateCreateActionUser, validateUpdateActionUser } = Container.get(UserMiddlewareService);

    route.get('/:id', getUserById);

    route.post('/', validateCreateActionUser, createUser);

    route.patch('/:id', validateUpdateActionUser, updateUser);

    route.delete('/:id', deleteUser);

    route.post('/auto-suggest', autoSuggestUsers);
};
