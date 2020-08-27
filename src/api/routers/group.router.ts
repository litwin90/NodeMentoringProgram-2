import * as express from 'express';
import { Container } from 'typedi';

import { GroupService } from '../../services';
import { HTTP_CODES } from '../constants';
import { GroupMiddlewareService } from '../middlewares';

const route = express.Router();

export const groupRouter = (app: express.Router) => {
    app.use('/group', route);

    const groupService = Container.get(GroupService);
    const groupMiddlewareService = Container.get(GroupMiddlewareService);

    route.get('/', async (req, res) => {
        try {
            const groups = await groupService.getAllGroups();

            res.status(HTTP_CODES.OK).json(groups);
        } catch (error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(error);
        }
    });

    route.get('/:id', async (req, res) => {
        try {
            const groupId = req.params.id;

            const group = await groupService.getGroupById(groupId);

            if (!group) {
                res.status(HTTP_CODES.NOT_FOUND).send(`Group with id: ${groupId} not found`);
                return;
            }
            res.status(HTTP_CODES.OK).json(group);
        } catch (error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(error);
        }
    });

    route.post('/', groupMiddlewareService.validateCreateActionGroup, async (req, res) => {
        try {
            const newGroup = await groupService.creatGroup(req.body);

            res.status(HTTP_CODES.OK).json(newGroup);
        } catch (error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(error);
        }
    });

    route.patch('/:id', groupMiddlewareService.validateUpdateActionGroup, async (req, res) => {
        try {
            const groupId = req.params.id;

            const [updatedDocumentsCount] = await groupService.updateGroup(groupId, req.body);

            switch (updatedDocumentsCount) {
                case 1:
                    res.status(HTTP_CODES.OK).send(`Group id: ${groupId} is updated`);
                    break;
                case 0:
                    res.status(HTTP_CODES.NOT_FOUND).send(`Group with id: ${groupId} not found`);
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
            const groupId = req.params.id;
            const deletedDocumentsCount = await groupService.deleteGroup(groupId);

            switch (deletedDocumentsCount) {
                case 1:
                    res.status(HTTP_CODES.OK).send(`Group id: ${groupId} is deleted`);
                    break;
                case 0:
                    res.status(HTTP_CODES.NOT_FOUND).send(`Group with id: ${groupId} not found`);
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
};
