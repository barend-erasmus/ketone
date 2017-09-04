// Imports models
import { Permission } from './../entities/permission';
import { Role } from './../entities/role';

export interface IRoleRepository {

    create(role: Role, clientId: string): Promise<boolean>;

    update(role: Role, clientId: string): Promise<boolean>;

    listByClientId(clientId: string): Promise<Role[]>;

    find(name: string, group: string, clientId: string): Promise<Role>;

    listByUsername(username: string, clientId: string): Promise<Role[]>;

    listPermissions(username: string, clientId: string): Promise<Permission[]>;
}
