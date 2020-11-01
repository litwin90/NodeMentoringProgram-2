import { CreateActionUser, IUser, UpdateActionUser } from '../../interfaces';
import { AppMockConstant } from '../../mock';

export class MockUserService {
    users: IUser[] = [];

    async getUserById(id: string) {
        return this.users.find((user) => user.id === id) || null;
    }

    async createUser(createActionUser: CreateActionUser) {
        return {
            ...createActionUser,
            id: AppMockConstant.MockId,
        };
    }

    async updateUser(userId: string, updateActionUser: UpdateActionUser) {
        const updatedUsers = this.users.filter(({ id }) => id === userId).map((u) => ({ ...u, updateActionUser }));

        return [updatedUsers.length];
    }

    async deleteUser(userId: string) {
        const deletedUsers = this.users.filter(({ id }) => id === userId);

        return deletedUsers.length;
    }

    async autoSuggest(loginSubstring: string, limit: number) {
        const updatedUsers = this.users.filter(({ login }) => login.includes(loginSubstring));
        updatedUsers.length = updatedUsers.length > limit ? limit : updatedUsers.length;

        return updatedUsers;
    }

    resetUsers() {
        this.users = [];
    }

    setUsers(users: IUser[]) {
        this.users = users;
    }
}
