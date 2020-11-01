import { Optional } from 'sequelize/types';

export interface IRefreshToken {
    id: string;
    token: string;
    expires: number;
}

export type CreateActionRefreshToken = Optional<IRefreshToken, 'id'>;
