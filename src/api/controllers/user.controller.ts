import { Request, Response } from 'express';
import { Service } from 'typedi';

import { HandleError, LogRequestData } from '../../decorators';
import { UserService } from '../../services';
import { HttpCode } from '../constants';

@Service()
export class UserController {
    constructor(public userService: UserService) {
        console.log('UserController');
    }

    @LogRequestData()
    @HandleError()
    async getUserById(req: Request, res: Response) {
        const userId = req.params.id;

        const user = await this.userService.getUserById(userId);

        if (!user) {
            res.status(HttpCode.NOT_FOUND).send(`User with id: ${userId} not found`);
            return;
        }
        res.status(HttpCode.OK).json(user);
    }

    @LogRequestData()
    @HandleError()
    async createUser(req: Request, res: Response) {
        const newUser = await this.userService.createUser(req.body);

        res.status(HttpCode.OK).json(newUser);
    }

    @LogRequestData()
    @HandleError()
    async updateUser(req: Request, res: Response) {
        const userId = req.params.id;

        const [updatedDocumentsCount] = await this.userService.updateUser(userId, req.body);

        switch (updatedDocumentsCount) {
            case 1:
                res.status(HttpCode.OK).send(`User id: ${userId} is updated`);
                break;
            case 0:
                res.status(HttpCode.NOT_FOUND).send(`User with id: ${userId} not found`);
                break;
            default:
                res.status(HttpCode.INTERNAL_SERVER_ERROR).send(
                    `Smth went wrong. Updated documents count: ${updatedDocumentsCount}`,
                );
                break;
        }
    }

    @LogRequestData()
    @HandleError()
    async deleteUser(req: Request, res: Response) {
        const userId = req.params.id;

        const deletedDocumentsCount = await this.userService.deleteUser(userId);

        switch (deletedDocumentsCount) {
            case 1:
                res.status(HttpCode.OK).send(`User id: ${userId} is deleted`);
                break;
            case 0:
                res.status(HttpCode.NOT_FOUND).send(`User with id: ${userId} not found`);
                break;
            default:
                res.status(HttpCode.INTERNAL_SERVER_ERROR).send(
                    `Smth went wrong. Deleted documents count: ${deletedDocumentsCount}`,
                );
                break;
        }
    }

    @LogRequestData()
    @HandleError()
    async autoSuggestUsers(req: Request, res: Response) {
        const { loginSubstring, limit } = req.body;

        const matchedUsers = await this.userService.autoSuggest(loginSubstring, limit);

        res.status(HttpCode.OK).json(matchedUsers);
    }
}
