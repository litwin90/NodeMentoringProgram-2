import { Dialect } from 'sequelize';

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
        },
    },
};
