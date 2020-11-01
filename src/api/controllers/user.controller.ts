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
            return res.status(HttpCode.NotFound).send(`User with id: ${userId} not found`);
        }
        return res.status(HttpCode.Ok).json(user);
    }

    @LogRequestData()
    @HandleError()
    async createUser(req: Request, res: Response) {
        const newUser = await this.userService.createUser(req.body);

        return res.status(HttpCode.Ok).json(newUser);
    }

    @LogRequestData()
    @HandleError()
    async updateUser(req: Request, res: Response) {
        const userId = req.params.id;

        const [updatedDocumentsCount] = await this.userService.updateUser(userId, req.body);

        switch (updatedDocumentsCount) {
            case 1:
                return res.status(HttpCode.Ok).send(`User id: ${userId} is updated`);
            case 0:
                return res.status(HttpCode.NotFound).send(`User with id: ${userId} not found`);
            default:
                return res
                    .status(HttpCode.InternalServerError)
                    .send(`Smth went wrong. Updated documents count: ${updatedDocumentsCount}`);
        }
    }

    @LogRequestData()
    @HandleError()
    async deleteUser(req: Request, res: Response) {
        const userId = req.params.id;

        const deletedDocumentsCount = await this.userService.deleteUser(userId);

        switch (deletedDocumentsCount) {
            case 1:
                return res.status(HttpCode.Ok).send(`User id: ${userId} is deleted`);
            case 0:
                return res.status(HttpCode.NotFound).send(`User with id: ${userId} not found`);
            default:
                return res
                    .status(HttpCode.InternalServerError)
                    .send(`Smth went wrong. Deleted documents count: ${deletedDocumentsCount}`);
        }
    }

    @LogRequestData()
    @HandleError()
    async autoSuggestUsers(req: Request, res: Response) {
        const { loginSubstring, limit } = req.body;

        const matchedUsers = await this.userService.autoSuggest(loginSubstring, limit);

        return res.status(HttpCode.Ok).json(matchedUsers);
    }
}
