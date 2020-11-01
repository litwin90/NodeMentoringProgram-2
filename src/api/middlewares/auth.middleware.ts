import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import Container, { Service } from 'typedi';

import { Config } from '../../config';
import { RefreshTokenService } from '../../services';
import { HttpCode, HttpMessage } from '../constants';

@Service()
export class AuthMiddlewareService {
    async authCheckMiddleware(req: Request, res: Response, next: NextFunction) {
        const token = req.headers[Config.auth.accessHeader] as string;

        if (!token) {
            return res.status(HttpCode.Unauthorized).send(HttpMessage.Unauthorized);
        }

        return jwt.verify(token, Config.auth.secret, (error) => {
            if (error) {
                return res.status(HttpCode.Unauthorized).send(HttpMessage.Unauthorized);
            }

            return next();
        });
    }

    async refreshAccessTokenMiddleware(req: Request, res: Response, next: NextFunction) {
        const { userId, refreshToken } = req.body;
        const token = req.headers[Config.auth.accessHeader] as string;

        return jwt.verify(token, Config.auth.secret, async (error) => {
            if (error) {
                const refreshTokenService = Container.get(RefreshTokenService);
                const refreshTokenDTO = await refreshTokenService.getTokensByUserId(userId);

                if (!refreshTokenDTO || refreshToken !== refreshTokenDTO.token) {
                    return next();
                }

                const accessToken = jwt.sign({ sub: userId }, Config.auth.secret, {
                    expiresIn: Config.auth.jwtExpiration,
                });

                req.headers[Config.auth.accessHeader] = accessToken;
                res.setHeader(Config.auth.accessHeader, accessToken);
                return next();
            }

            return next();
        });
    }
}
