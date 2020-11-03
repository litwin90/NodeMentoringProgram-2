import { CreateActionGroup, IGroup, UpdateActionGroup } from '../../interfaces';
import { AppMockConstant } from '../../mock';

export class MockGroupService {
    groups: IGroup[] = [];

    async getGroupById(id: string) {
        return this.groups.find((group) => group.id === id) || null;
    }

    async getAllGroups() {
        return this.groups;
    }

    async creatGroup(createActionGroup: CreateActionGroup) {
        const newGroup = {
            ...createActionGroup,
            id: AppMockConstant.MockId,
        };

        this.groups.push(newGroup);
        return newGroup;
    }

    async updateGroup(groupId: string, updateActionGroup: UpdateActionGroup) {
        const updatedGroups = this.groups.filter(({ id }) => id === groupId).map((g) => ({ ...g, updateActionGroup }));
        return [updatedGroups.length];
    }

    async deleteGroup(id: string) {
        const groupsToDelete = this.groups.filter((group) => group.id === id);
        return groupsToDelete.length;
    }

    resetGroups() {
        this.groups = [];
    }

    setGroups(groups: IGroup[]) {
        this.groups = groups;
    }
}
