// Imports models
import { Permission } from './../entities/permission';

export interface IPermissionRepository {

    create(permission: Permission, clientId: string): Promise<boolean>;

    find(name: string, clientId: string): Promise<Permission>;

    listByClientId(clientId: string): Promise<Permission[]>;

    update(permission: Permission, clientId: string): Promise<boolean>;
}
