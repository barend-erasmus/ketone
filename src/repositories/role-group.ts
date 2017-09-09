// Imports models
import { RoleGroup } from './../entities/role-group';

export interface IRoleGroupRepository {

    create(roleGroup: RoleGroup, clientId: string): Promise<boolean>;

    list(clientId: string): Promise<RoleGroup[]>;

    update(roleGroup: RoleGroup, clientId: string): Promise<boolean>;

    find(name: string, clientId: string): Promise<RoleGroup>;
}
