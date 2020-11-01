import { ModelCtor } from 'sequelize/types';
import { Inject, Service } from 'typedi';
import { v4 as uuidv4 } from 'uuid';

import { Config } from '../config';
import { IRefreshTokenInstance, IUserInstance } from '../models';

@Service()
export class RefreshTokenService {
    constructor(
        @Inject(Config.injectionToken.model.user) private userModel: ModelCtor<IUserInstance>,
        @Inject(Config.injectionToken.model.refreshToken) private refreshTokenModel: ModelCtor<IRefreshTokenInstance>,
    ) {}

    async getTokensByUserId(userId: string) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            return;
        }

        return this.getNotExpiredRefreshTokenByUser(user);
    }

    async createToken(user: IUserInstance) {
        const refreshToken = await this.getNotExpiredRefreshTokenByUser(user);

        if (!refreshToken) {
            const token = uuidv4();
            return user.createRefreshToken({ token });
        }

        return refreshToken;
    }

    async removeToken(token: string) {
        return await this.refreshTokenModel.destroy({
            where: {
                token,
            },
        });
    }

    async getNotExpiredRefreshTokenByUser(user: IUserInstance) {
        const refreshTokens = await user.getRefreshTokens();
        const notExpiredToken = refreshTokens.find((token) => {
            const tokenExpiration = token.expires;
            const currentDate = Date.now();

            const isExpired = tokenExpiration < currentDate;

            return !isExpired;
        });
        return notExpiredToken;
    }
}
