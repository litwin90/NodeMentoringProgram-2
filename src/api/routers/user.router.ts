import * as express from 'express';
import { Container } from 'typedi';

import { UserService } from '../../services';
import { HTTP_CODES } from '../constants';
import { UserMiddlewareService } from '../middlewares';

const route = express.Router();

export const userRoute = (app: express.Router) => {
    app.use('/user', route);

    const userService = Container.get(UserService);
    const userMiddlewareService = Container.get(UserMiddlewareService);

    route.get('/:id', async (req, res) => {
        try {
            const userId = req.params.id;

            const user = await userService.getUserById(userId);

            if (!user) {
                res.status(HTTP_CODES.NOT_FOUND).send(`User with id: ${userId} not found`);
                return;
            }
            res.status(HTTP_CODES.OK).json(user);
        } catch (error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(error);
        }
    });

    route.post('/', userMiddlewareService.validateCreateActionUser, async (req, res) => {
        try {
            const newUser = await userService.createUser(req.body);

            res.status(HTTP_CODES.OK).json(newUser);
        } catch (error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(error);
        }
    });

    route.patch('/:id', userMiddlewareService.validateUpdateActionUser, async (req, res) => {
        try {
            const userId = req.params.id;

            const [updatedDocumentsCount] = await userService.updateUser(userId, req.body);

            switch (updatedDocumentsCount) {
                case 1:
                    res.status(HTTP_CODES.OK).send(`User id: ${userId} is updated`);
                    break;
                case 0:
                    res.status(HTTP_CODES.NOT_FOUND).send(`User with id: ${userId} not found`);
                    break;
                default:
                    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(
                        `Smth went wrong. Updated documents count: ${updatedDocumentsCount}`,
                    );
                    break;
            }
        } catch (error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(error);
        }
    });

    route.delete('/:id', async (req, res) => {
        try {
            const userId = req.params.id;

            const deletedDocumentsCount = await userService.deleteUser(userId);

            switch (deletedDocumentsCount) {
                case 1:
                    res.status(HTTP_CODES.OK).send(`User id: ${userId} is deleted`);
                    break;
                case 0:
                    res.status(HTTP_CODES.NOT_FOUND).send(`User with id: ${userId} not found`);
                    break;
                default:
                    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(
                        `Smth went wrong. Deleted documents count: ${deletedDocumentsCount}`,
                    );
                    break;
            }
        } catch (error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(error);
        }
    });

    route.post('/auto-suggest', async (req, res) => {
        try {
            const { loginSubstring, limit } = req.body;

            const matchedUsers = await userService.autoSuggest(loginSubstring, limit);

            res.status(HTTP_CODES.OK).json(matchedUsers);
        } catch (error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(error);
        }
    });
};
