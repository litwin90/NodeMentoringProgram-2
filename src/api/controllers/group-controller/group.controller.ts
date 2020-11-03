import { Request, Response } from 'express';
import Container, { Service } from 'typedi';

import { HandleError, LogRequestData } from '../../../decorators';
import { GroupService } from '../../../services';
import { HttpCode } from '../../constants';

@Service()
export class GroupController {
    groupService = Container.get(GroupService);

    @LogRequestData()
    @HandleError()
    async getGroups(req: Pick<Request, 'body' | 'params'>, res: Response) {
        const groups = await this.groupService.getAllGroups();

        return res.status(HttpCode.Ok).json(groups);
    }

    @LogRequestData()
    @HandleError()
    async getGroupById(req: Pick<Request, 'params'>, res: Response) {
        const groupId = req.params.id;

        const group = await this.groupService.getGroupById(groupId);

        if (!group) {
            return res.status(HttpCode.NotFound).send(`Group with id: ${groupId} not found`);
        }
        return res.status(HttpCode.Ok).json(group);
    }

    @LogRequestData()
    @HandleError()
    async createGroup(req: Pick<Request, 'body'>, res: Response) {
        const newGroup = await this.groupService.creatGroup(req.body);

        return res.status(HttpCode.Ok).json(newGroup);
    }

    @LogRequestData()
    @HandleError()
    async updateGroup(req: Pick<Request, 'params' | 'body'>, res: Response) {
        const groupId = req.params.id;

        const [updatedDocumentsCount] = await this.groupService.updateGroup(groupId, req.body);

        switch (updatedDocumentsCount) {
            case 1:
                return res.status(HttpCode.Ok).send(`Group id: ${groupId} is updated`);

            case 0:
                return res.status(HttpCode.NotFound).send(`Group with id: ${groupId} not found`);
            default:
                return res
                    .status(HttpCode.InternalServerError)
                    .send(`Smth went wrong. Updated documents count: ${updatedDocumentsCount}`);
        }
    }

    @LogRequestData()
    @HandleError()
    async deleteGroup(req: Pick<Request, 'params'>, res: Response) {
        const groupId = req.params.id;
        const deletedDocumentsCount = await this.groupService.deleteGroup(groupId);

        switch (deletedDocumentsCount) {
            case 1:
                return res.status(HttpCode.Ok).send(`Group id: ${groupId} is deleted`);
            case 0:
                return res.status(HttpCode.NotFound).send(`Group with id: ${groupId} not found`);
            default:
                return res
                    .status(HttpCode.InternalServerError)
                    .send(`Smth went wrong. Deleted documents count: ${deletedDocumentsCount}`);
        }
    }
}
