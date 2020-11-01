import { Router } from 'express';
import Container from 'typedi';

import { AuthController } from '../controllers';

const authRoute = Router();

export enum AuthRouteName {
    Login = '/login',
    DeleteRefreshToken = '/delete-refresh-token',
}

export const authRouter = (app: Router, appRouteName: string) => {
    app.use(appRouteName, authRoute);

    const { login, deleteRefreshToken } = Container.get(AuthController);

    authRoute.post(AuthRouteName.Login, login);
    authRoute.delete(AuthRouteName.DeleteRefreshToken, deleteRefreshToken);
};
