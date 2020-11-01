import * as express from 'express';
import { Container } from 'typedi';

import { UserController } from '../controllers';
import { UserMiddlewareService } from '../middlewares';

const userRoute = express.Router();

export enum UserRouteName {
    AutoSuggest = '/auto-suggest',
}

export const userRouter = (app: express.Router, appRouteName: string) => {
    app.use(appRouteName, userRoute);

    const { getUserById, createUser, updateUser, deleteUser, autoSuggestUsers } = Container.get(UserController);
    const { validateCreateActionUser, validateUpdateActionUser } = Container.get(UserMiddlewareService);

    userRoute.get('/:id', getUserById);

    userRoute.post('/', validateCreateActionUser, createUser);

    userRoute.patch('/:id', validateUpdateActionUser, updateUser);

    userRoute.delete('/:id', deleteUser);

    userRoute.post(UserRouteName.AutoSuggest, autoSuggestUsers);
};
