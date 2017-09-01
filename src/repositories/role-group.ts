// Imports models
import { RoleGroup } from './../entities/role-group';

export interface IRoleGroupRepository {

    create(roleGroup: RoleGroup, clientId: string): Promise<boolean>;

    update(roleGroup: RoleGroup, clientId: string): Promise<boolean>;
}
