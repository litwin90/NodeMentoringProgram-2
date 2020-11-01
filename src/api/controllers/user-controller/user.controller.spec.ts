import Container from 'typedi';

import { CreateActionUser, IUser, UpdateActionUser } from '../../../interfaces';
import { AppMockConstant, mockRequest, mockResponse } from '../../../mock';
import { MockUserService, UserService } from '../../../services';
import { HttpCode } from '../../constants';
import { UserController } from './user.controller';

const mockUser: IUser = {
    id: AppMockConstant.MockId,
    login: 'user1',
    password: 'password',
    age: 20,
};

const updateActionUser: UpdateActionUser = {
    login: 'user2',
    password: 'password2',
    age: 30,
};

const createActionUser: CreateActionUser = {
    login: 'user1',
    password: 'password',
    age: 20,
};

describe('UserController', () => {
    const mockUserService = new MockUserService();
    Container.set(UserService, mockUserService);
    const userController = Container.get(UserController);

    beforeEach(() => {
        mockUserService.resetUsers();
    });
    describe('getUserById', () => {
        it('should return status NOT FOUND if user does not exist', async () => {
            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.NotFound);
        });
        it('should return status OK if user exist', async () => {
            mockUserService.setUsers([mockUser]);

            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.Ok);
        });
        it('should return message `User with id: ${userId} not found` if user does not exist', async () => {
            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.getUserById(req, res);

            expect(res.send).toHaveBeenCalledWith(`User with id: ${AppMockConstant.MockId} not found`);
        });
        it('should return user if user exist ', async () => {
            mockUserService.setUsers([mockUser]);

            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.getUserById(req, res);

            expect(res.json).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('createUser', () => {
        it('should return status OK after user creation', async () => {
            const req = mockRequest({ body: createActionUser });
            const res = mockResponse();

            await userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.Ok);
        });
        it('should return new user', async () => {
            const req = mockRequest({ body: createActionUser });
            const res = mockResponse();

            await userController.createUser(req, res);

            expect(res.json).toHaveBeenCalledWith({ ...createActionUser, id: AppMockConstant.MockId });
        });
    });

    describe('updateUser', () => {
        it('should return status OK if user updated', async () => {
            mockUserService.setUsers([mockUser]);

            const req = mockRequest({ body: updateActionUser, params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.Ok);
        });
        it('should return status NOT FOUND if user with passed id nod found', async () => {
            const req = mockRequest({ body: updateActionUser, params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.NotFound);
        });
        it('should return status INTERNAL SERVER ERROR if updated users count is more then 1', async () => {
            mockUserService.setUsers([mockUser, mockUser]);

            const req = mockRequest({ body: updateActionUser, params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.InternalServerError);
        });
        it('should return message `User id: ${userId} is updated` if user updated', async () => {
            mockUserService.setUsers([mockUser]);

            const req = mockRequest({ body: updateActionUser, params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.updateUser(req, res);

            expect(res.send).toHaveBeenCalledWith(`User id: ${AppMockConstant.MockId} is updated`);
        });
        it('should return message `User with id: ${userId} not found` if user with passed id nod found', async () => {
            const req = mockRequest({ body: updateActionUser, params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.updateUser(req, res);

            expect(res.send).toHaveBeenCalledWith(`User with id: ${AppMockConstant.MockId} not found`);
        });
        it('should return message `Smth went wrong. Updated documents count: ${updatedDocumentsCount}` if updated users count is more then 1', async () => {
            mockUserService.setUsers([mockUser, mockUser]);

            const req = mockRequest({ body: updateActionUser, params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.updateUser(req, res);

            expect(res.send).toHaveBeenCalledWith(`Smth went wrong. Updated documents count: ${2}`);
        });
    });

    describe('deleteUser', () => {
        it('should return status OK if user deleted', async () => {
            mockUserService.setUsers([mockUser]);

            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.Ok);
        });

        it('should return status NOT FOUND if user is not deleted', async () => {
            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.NotFound);
        });

        it('should return status INTERNAL SERVER ERROR if deleted users count more then 1', async () => {
            mockUserService.setUsers([mockUser, mockUser]);

            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpCode.InternalServerError);
        });
        it('should return message `User id: ${userId} is deleted` if user deleted', async () => {
            mockUserService.setUsers([mockUser]);

            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.deleteUser(req, res);

            expect(res.send).toHaveBeenCalledWith(`User id: ${AppMockConstant.MockId} is deleted`);
        });

        it('should return message `User with id: ${userId} not found` if user is not deleted', async () => {
            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.deleteUser(req, res);

            expect(res.send).toHaveBeenCalledWith(`User with id: ${AppMockConstant.MockId} not found`);
        });

        it('should return message `Smth went wrong. Deleted documents count: ${deletedDocumentsCount}` if deleted users count more then 1', async () => {
            mockUserService.setUsers([mockUser, mockUser]);

            const req = mockRequest({ params: { id: AppMockConstant.MockId } });
            const res = mockResponse();

            await userController.deleteUser(req, res);

            expect(res.send).toHaveBeenCalledWith(`Smth went wrong. Deleted documents count: ${2}`);
        });
    });

    describe('autoSuggestUsers', () => {
        it('should return status OK', async () => {
            const req = mockRequest({ body: { loginSubstring: 'loginSubstring', limit: 10 } });
            const res = mockResponse();

            await userController.autoSuggestUsers(req, res);
            expect(res.status).toHaveBeenCalledWith(HttpCode.Ok);
        });
        it('should return array of suggestions', async () => {
            const req = mockRequest({ body: { loginSubstring: 'loginSubstring', limit: 10 } });
            const res = mockResponse();

            await userController.autoSuggestUsers(req, res);
            expect(res.json).toHaveBeenCalledWith([]);
        });
    });
});
