// Imports
import { IPermissionRepository } from './../permission';

// Imports models
import { Permission } from './../../entities/permission';

export class PermissionRepository implements IPermissionRepository {

    private permissions: {} = {};

    public async create(permission: Permission, clientId: string): Promise<boolean> {
        if (this.permissions[clientId]) {
            this.permissions[clientId].push(permission);
        } else {
            this.permissions[clientId] = [permission];
        }

        return true;
    }

    public async find(name: string, clientId: string): Promise<Permission> {
        return this.permissions[clientId] ? this.permissions[clientId].find((x) => x.name === name) : null;
    }

    public async listByClientId(clientId: string): Promise<Permission[]> {
        return this.permissions[clientId];
    }

    public async update(permission: Permission, clientId: string): Promise<boolean> {
        return true;
    }
}
