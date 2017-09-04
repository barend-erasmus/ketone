// Imports models
import { Permission } from './../entities/permission';

export interface IPermissionRepository {

    create(permission: Permission, clientId: string): Promise<boolean>;

    update(permission: Permission, clientId: string): Promise<boolean>;
}
