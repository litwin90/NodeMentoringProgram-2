import * as express from 'express';

import { HTTP_CODES } from '../../constants';
import { IUser } from '../../models';
import { validatePartialUser, validateUser } from '../../validations/validations';
import { createUser, updateUser } from './helpers';

export const userRouter = express.Router();

const users = new Map<string, IUser>();

const testUser: IUser = {
    id: 'b5c8aaf5-2df7-4dfb-a44f-7c8e7b8da959',
    login: 'Userlogin',
    password: 'Xvfasdfvsdfv4',
    age: 25,
    isDeleted: false,
};

users.set(testUser.id, testUser);

userRouter.get('/:id', (req, res) => {
    const userId = req.params.id;

    const user = users.get(userId);

    if (user && !user.isDeleted) {
        res.status(HTTP_CODES.OK).json(user);
    } else {
        res.status(HTTP_CODES.NOT_FOUND).send(`User with id: ${userId} not found`);
    }
});

userRouter.post('/', validateUser, (req, res) => {
    const allUsers = Array.from(users.values());

    const userExists = allUsers.some(({ login, isDeleted }) => req.body.login === login && !isDeleted);

    if (userExists) {
        res.status(HTTP_CODES.BAD_REQUEST).send(`User with login ${req.body.login} already exists`);
        return;
    }

    const newUser = createUser(req.body);
    users.set(newUser.id, newUser);
    res.status(HTTP_CODES.OK).json(newUser);
});

userRouter.patch('/:id', validatePartialUser, (req, res) => {
    const userId = req.params.id;

    const user = users.get(userId);

    if (user) {
        const newUser = updateUser(user, req.body);
        users.set(newUser.id, newUser);

        res.status(HTTP_CODES.OK).json(newUser);
    } else {
        res.status(HTTP_CODES.NOT_FOUND).send(`User with id: ${userId} not found`);
    }
});

userRouter.delete('/:id', (req, res) => {
    const userId = req.params.id;

    const user = users.get(userId);

    if (user) {
        const newUser = updateUser(user, { isDeleted: true });
        users.set(newUser.id, newUser);

        res.status(HTTP_CODES.OK).send(`User with id: ${userId} is deleted`);
    } else {
        res.status(HTTP_CODES.NOT_FOUND).send(`User with id: ${userId} not found`);
    }
});

userRouter.post('/auto-suggest', (req, res) => {
    const { loginSubstring, limit } = req.body;

    const allUsers = Array.from(users.values());

    const matchedUsers = allUsers.filter(({ login, isDeleted }) => login.includes(loginSubstring) && !isDeleted);

    if (matchedUsers.length > limit) {
        matchedUsers.length = limit;
    }

    res.status(HTTP_CODES.OK).json(matchedUsers);
});
