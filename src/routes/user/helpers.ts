import { v4 as uuidv4 } from 'uuid';

import { IUser, UserToValidate } from '../../models';

export const createUser = (newUser: UserToValidate): IUser => {
    return {
        id: uuidv4(),
        ...newUser,
        isDeleted: false,
    };
};

export const updateUser = (userToUpdate: IUser, newUser: Partial<IUser>): IUser => {
    return {
        ...userToUpdate,
        ...newUser,
    };
};
