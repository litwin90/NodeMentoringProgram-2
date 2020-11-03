import Container from 'typedi';

import { CreateActionGroup, IGroup, UpdateActionGroup } from '../../../interfaces';
import { AppMockConstant, mockRequest, mockResponse } from '../../../mock';
import { GroupService } from '../../../services';
import { MockGroupService } from '../../../services/group-service/mock-group.service';
import { HttpCode } from '../../constants';
import { GroupController } from './group.controller';

const mockGroup: IGroup = {
    id: AppMockConstant.MockId,
    name: AppMockConstant.MockName,
    permissions: [],
};

const updateActionGroup: UpdateActionGroup = {
    name: AppMockConstant.MockName,
    permissions: [],
};

const createActionGroup: CreateActionGroup = {
    name: AppMockConstant.MockName,
    permissions: [],
};

describe('GroupController', () => {
    const mockGroupService = new MockGroupService();
    Container.set(GroupService, mockGroupService);
    const groupController = Container.get(GroupController);

    beforeEach(() => {
        mockGroupService.resetGroups();
    });

    describe('getGroups', () => {
        it('should return status OK', async () => {
            const req = mockRequest({});
            const res = mockResponse();

            await groupController.getGroups(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.Ok);
        });
        it('should return all groups', async () => {
            const req = mockRequest({});
            const res = mockResponse();
            mockGroupService.setGroups([mockGroup, mockGroup]);

            await groupController.getGroups(req, res);

            expect(res.json).toHaveBeenCalledWith([mockGroup, mockGroup]);
        });
    });
    describe('getGroupById', () => {
        it('should return status OK if group found', async () => {
            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();
            mockGroupService.setGroups([mockGroup]);

            await groupController.getGroupById(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.Ok);
        });
        it('should return status NOT FOUND if group not found', async () => {
            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await groupController.getGroupById(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.NotFound);
        });
        it('should return group if group found', async () => {
            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();
            mockGroupService.setGroups([mockGroup]);

            await groupController.getGroupById(req, res);

            expect(res.json).toHaveBeenCalledWith(mockGroup);
        });
        it('should return message `Group with id: ${groupId} not found` if group not found', async () => {
            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await groupController.getGroupById(req, res);

            expect(res.send).toHaveBeenCalledWith(`Group with id: ${AppMockConstant.MockId} not found`);
        });
    });
    describe('createGroup', () => {
        it('should return status OK ', async () => {
            const req = mockRequest({ body: createActionGroup });
            const res = mockResponse();

            await groupController.createGroup(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.Ok);
        });
        it('should return new group ', async () => {
            const req = mockRequest({ body: createActionGroup });
            const res = mockResponse();

            await groupController.createGroup(req, res);

            expect(res.json).toHaveBeenCalledWith(mockGroup);
        });
    });
    describe('updateGroup', () => {
        it('should return status OK if group updated', async () => {
            const req = mockRequest({ body: updateActionGroup, params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            mockGroupService.setGroups([mockGroup]);

            await groupController.updateGroup(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.Ok);
        });
        it('should return status NOT FOUND if no groups updated', async () => {
            const req = mockRequest({ body: updateActionGroup, params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await groupController.updateGroup(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.NotFound);
        });
        it('should return status INTERNAL SERVER ERROR if updated groups count more then 1', async () => {
            const req = mockRequest({ body: updateActionGroup, params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            mockGroupService.setGroups([mockGroup, mockGroup]);

            await groupController.updateGroup(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.InternalServerError);
        });
        it('should return message `Group id: ${groupId} is updated` if group updated', async () => {
            const req = mockRequest({ body: updateActionGroup, params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            mockGroupService.setGroups([mockGroup]);

            await groupController.updateGroup(req, res);

            expect(res.send).toHaveBeenCalledWith(`Group id: ${AppMockConstant.MockId} is updated`);
        });
        it('should return message `Group with id: ${groupId} not found` if no groups updated', async () => {
            const req = mockRequest({ body: updateActionGroup, params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await groupController.updateGroup(req, res);

            expect(res.send).toHaveBeenCalledWith(`Group with id: ${AppMockConstant.MockId} not found`);
        });
        it('should return message `Smth went wrong. Updated documents count: ${updatedDocumentsCount}` if updated groups count more then 1', async () => {
            const req = mockRequest({ body: updateActionGroup, params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            mockGroupService.setGroups([mockGroup, mockGroup]);

            await groupController.updateGroup(req, res);

            expect(res.send).toHaveBeenCalledWith(`Smth went wrong. Updated documents count: ${2}`);
        });
    });
    describe('deleteGroup', () => {
        it('should return status OK if group deleted', async () => {
            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            mockGroupService.setGroups([mockGroup]);

            await groupController.deleteGroup(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.Ok);
        });
        it('should return status NOT FOUND if no groups deleted', async () => {
            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await groupController.deleteGroup(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.NotFound);
        });
        it('should return status INTERNAL SERVER ERROR if deleted groups count more then 1', async () => {
            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            mockGroupService.setGroups([mockGroup, mockGroup]);

            await groupController.deleteGroup(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.InternalServerError);
        });
        it('should return message `Group id: ${groupId} is deleted` if group updated', async () => {
            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            mockGroupService.setGroups([mockGroup]);

            await groupController.deleteGroup(req, res);

            expect(res.send).toHaveBeenCalledWith(`Group id: ${AppMockConstant.MockId} is deleted`);
        });
        it('should return message `Group with id: ${groupId} not found` if no groups updated', async () => {
            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await groupController.deleteGroup(req, res);

            expect(res.send).toHaveBeenCalledWith(`Group with id: ${AppMockConstant.MockId} not found`);
        });
        it('should return message `Smth went wrong. Deleted documents count: ${updatedDocumentsCount}` if deleted groups count more then 1', async () => {
            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            mockGroupService.setGroups([mockGroup, mockGroup]);

            await groupController.deleteGroup(req, res);

            expect(res.send).toHaveBeenCalledWith(`Smth went wrong. Deleted documents count: ${2}`);
        });
    });
});
