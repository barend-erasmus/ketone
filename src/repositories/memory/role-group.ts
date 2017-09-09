// Imports models
import { RoleGroup } from './../../entities/role-group';

export class RoleGroupRepository {
    
    private roleGroups: {} = {};

    public async create(roleGroup: RoleGroup, clientId: string): Promise<boolean> {
        if (this.roleGroups[clientId]) {
            this.roleGroups[clientId].push(roleGroup);
        } else {
            this.roleGroups[clientId] = [roleGroup];
        }

        return true;
    }

    public async list(clientId: string): Promise<RoleGroup[]> {
        return this.roleGroups[clientId];
    }

    public async  update(roleGroup: RoleGroup, clientId: string): Promise<boolean> {
        return true;
    }

    public async find(name: string, clientId: string): Promise<RoleGroup> {
        return this.roleGroups[clientId] ? this.roleGroups[clientId].find((x) => x.name === name) : null;
    }
}
