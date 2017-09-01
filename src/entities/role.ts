// Imports models
import { Permission } from './permission';
import { RoleGroup } from './role-group';

export class Role {
    constructor(public name: string, public group: RoleGroup, public permissions: Permission[]) {

    }
}
