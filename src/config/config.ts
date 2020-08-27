import { Dialect } from 'sequelize';

export const Config = {
    port: process.env.PORT,
    database: {
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
        password: process.env.DB_PASS,
        dialect: process.env.DB_DIALECT as Dialect,
    },
    injectionToken: {
        userModel: 'userModel',
        sequelize: 'sequelize',
    },
};
