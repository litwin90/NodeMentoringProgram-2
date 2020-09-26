import { Optional } from 'sequelize/types';

export interface IGroup {
    id: string;
    /**
     * @minLength 5
     * @maxLength 24
     */
    name: string;
    permissions: Permission[];
}

export enum Permission {
    Read = 'READ',
    Write = 'WRITE',
    Delete = 'DELETE',
    Share = 'SHARE',
    UploadFiles = 'UPLOAD_FILES',
}

export type CreateActionGroup = Optional<IGroup, 'id'>;
export type UpdateActionGroup = Omit<Optional<IGroup, 'name' | 'permissions'>, 'id'>;
