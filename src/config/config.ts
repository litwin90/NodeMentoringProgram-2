import dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config();

export const Config = {
    port: Number(process.env.PORT),
    host: process.env.HOST as string,
    database: {
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
        password: process.env.DB_PASS,
        dialect: process.env.DB_DIALECT as Dialect,
        namespace: 'app-namespace',
    },
    injectionToken: {
        sequelize: 'sequelize',
        model: {
            user: 'userModel',
            group: 'groupModel',
            refreshToken: 'refreshToken',
        },
    },
    auth: {
        secret: process.env.AUTH_SECRET || 'default_secret',
        jwtExpiration: Number(process.env.AUTH_JWT_EXPIRATION) || 120,
        accessHeader: process.env.AUTH_ACCESS_HEADER || 'x-access-token',
        refreshTokenExpirationDays: Number(process.env.AUTH_REFRESH_TOKEN_EXPIRATION_DAYS) || 1,
    },
    isLoggingEnabled: process.env.LOG_ENABLED === 'true',
};
