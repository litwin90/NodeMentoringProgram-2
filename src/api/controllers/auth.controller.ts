import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';

import { Config } from '../../config';
import { HandleError, LogRequestData } from '../../decorators';
import { RefreshTokenService, UserService } from '../../services';
import { HttpCode } from '../constants';

@Service()
export class AuthController {
    constructor(private userService: UserService, private refreshTokenService: RefreshTokenService) {}

    @LogRequestData()
    @HandleError()
    async login(req: Request, res: Response) {
        const { login, password } = req.body;
        const user = await this.userService.getUserByLogin(login);

        if (!user) {
            return res.sendStatus(HttpCode.NotFound);
        }

        if (password !== user?.password) {
            return res.sendStatus(HttpCode.Forbidden);
        }

        const accessToken = jwt.sign({ sub: user.id }, Config.auth.secret, { expiresIn: Config.auth.jwtExpiration });
        const existedRefreshToken = await this.refreshTokenService.getNotExpiredRefreshTokenByUser(user);

        if (existedRefreshToken) {
            return res.status(HttpCode.Ok).json({ accessToken, refreshToken: existedRefreshToken.token });
        }

        const refreshToken = await this.refreshTokenService.createToken(user);

        if (!refreshToken) {
            return res.sendStatus(HttpCode.InternalServerError);
        }

        return res.status(HttpCode.Ok).json({ accessToken, refreshToken: refreshToken.token });
    }

    @LogRequestData()
    @HandleError()
    async deleteRefreshToken(req: Request, res: Response) {
        const { refreshToken } = req.body;

        const deletedDocumentsCount = await this.refreshTokenService.removeToken(refreshToken);

        switch (deletedDocumentsCount) {
            case 1:
                return res.sendStatus(HttpCode.Ok);
            case 0:
                return res.sendStatus(HttpCode.NotFound);
            default:
                return res.sendStatus(HttpCode.InternalServerError);
        }
    }
}
