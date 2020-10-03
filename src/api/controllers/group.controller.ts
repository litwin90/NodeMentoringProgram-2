import { Request, Response } from 'express';
import { Service } from 'typedi';

import { HandleError, LogRequestData } from '../../decorators';
import { GroupService } from '../../services';
import { HttpCode } from '../constants';

@Service()
export class GroupController {
    constructor(private groupService: GroupService) {}

    @LogRequestData()
    @HandleError()
    async getGroups(req: Request, res: Response) {
        const groups = await this.groupService.getAllGroups();

        res.status(HttpCode.OK).json(groups);
    }

    @LogRequestData()
    @HandleError()
    async getGroupById(req: Request, res: Response) {
        const groupId = req.params.id;

        const group = await this.groupService.getGroupById(groupId);

        if (!group) {
            res.status(HttpCode.NOT_FOUND).send(`Group with id: ${groupId} not found`);
            return;
        }
        res.status(HttpCode.OK).json(group);
    }

    @LogRequestData()
    @HandleError()
    async createGroup(req: Request, res: Response) {
        const newGroup = await this.groupService.creatGroup(req.body);

        res.status(HttpCode.OK).json(newGroup);
    }

    @LogRequestData()
    @HandleError()
    async updateGroup(req: Request, res: Response) {
        const groupId = req.params.id;

        const [updatedDocumentsCount] = await this.groupService.updateGroup(groupId, req.body);

        switch (updatedDocumentsCount) {
            case 1:
                res.status(HttpCode.OK).send(`Group id: ${groupId} is updated`);
                break;
            case 0:
                res.status(HttpCode.NOT_FOUND).send(`Group with id: ${groupId} not found`);
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
    async deleteGroup(req: Request, res: Response) {
        const groupId = req.params.id;
        const deletedDocumentsCount = await this.groupService.deleteGroup(groupId);

        switch (deletedDocumentsCount) {
            case 1:
                res.status(HttpCode.OK).send(`Group id: ${groupId} is deleted`);
                break;
            case 0:
                res.status(HttpCode.NOT_FOUND).send(`Group with id: ${groupId} not found`);
                break;
            default:
                res.status(HttpCode.INTERNAL_SERVER_ERROR).send(
                    `Smth went wrong. Deleted documents count: ${deletedDocumentsCount}`,
                );
                break;
        }
    }
}
