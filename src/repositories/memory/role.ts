// Imports
import { IRoleRepository } from './../role';

// Imports models
import { Role } from './../../entities/role';
import { Permission } from './../../entities/permission';

export class RoleRepository implements IRoleRepository {

    private roles: {} = {};

    public async create(role: Role, clientId: string): Promise<boolean> {
        if (this.roles[clientId]) {
            this.roles[clientId].push(role);
        } else {
            this.roles[clientId] = [role];
        }

        return true;
    }

    public async find(name: string, group: string, clientId: string): Promise<Role> {
        return this.roles[clientId] ? this.roles[clientId].find((x) => x.name === name && x.group.name === group) : null;
    }

    public async listByClientId(clientId: string): Promise<Role[]> {
        return this.roles[clientId];
    }

    public async update(role: Role, clientId: string): Promise<boolean> {
        return true;
    }

    public async listByUsername(username: string, clientId: string): Promise<Role[]> {
        return null;
    }

    public async listPermissions(username: string, clientId: string): Promise<Permission[]> {
        return null;
    }
}
