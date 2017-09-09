// Imports
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import { config } from './../config';

// Imports repositories
import { IClientRepository } from './../repositories/client';
import { IRoleRepository } from './../repositories/role';
import { IRoleGroupRepository } from './../repositories/role-group';

// Imports models
import { Client } from './../entities/client';
import { Permission } from './../entities/permission';
import { Role } from './../entities/role';
import { RoleGroup } from './../entities/role-group';

export class RoleService {

    constructor(private roleRepository: IRoleRepository,
                private roleGroupRepository: IRoleGroupRepository,
                private clientRepository: IClientRepository) {

    }

    public async create(username: string, name: string, group: string, clientId: string): Promise<Role> {

        const client: Client = await this.clientRepository.find(clientId);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        const existingRole: Role = await this.roleRepository.find(name, group, clientId);

        if (existingRole) {
            throw new Error('Role already exist');
        }

        const role: Role = new Role(name, new RoleGroup(group), []);

        await this.roleRepository.create(role, clientId);

        return role;
    }

    public async createGroup(username: string, name: string, clientId: string): Promise<RoleGroup> {
        const roleGroup: RoleGroup = new RoleGroup(name);

        await this.roleGroupRepository.create(roleGroup, clientId);

        return roleGroup;
    }

    public async listGroups(username: string, clientId: string): Promise<RoleGroup[]> {

        const client: Client = await this.clientRepository.find(clientId);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        return this.roleGroupRepository.list(clientId);
    }

    public async find(username: string, name: string, group: string, clientId: string): Promise<Role> {
        const client: Client = await this.clientRepository.find(clientId);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        return this.roleRepository.find(name, group, clientId);
    }

    public async listByClientId(username: string, clientId: string): Promise<Role[]> {
        const client: Client = await this.clientRepository.find(clientId);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        return this.roleRepository.listByClientId(clientId);
    }

    public async addPermission(username: string, name: string, group: string, permissionName: string, clientId: string): Promise<Role> {
        const client: Client = await this.clientRepository.find(clientId);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        const role: Role = await this.roleRepository.find(name, group, clientId);

        role.permissions.push(new Permission(permissionName));

        await this.roleRepository.update(role, clientId);

        return role;
    }
}
