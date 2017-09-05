// Imports
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import { config } from './../config';

// Imports repositories
import { IClientRepository } from './../repositories/client';
import { IPermissionRepository } from './../repositories/permission';

// Imports models
import { Client } from './../entities/client';
import { Permission } from './../entities/permission';

export class PermissionService {

    constructor(private permissionRepository: IPermissionRepository,
                private clientRepository: IClientRepository) {

    }

    public async create(username: string, name: string, clientId: string): Promise<Permission> {
        const permission: Permission = new Permission(name);

        await this.permissionRepository.create(permission, clientId);

        return permission;
    }

    public async find(username: string, name: string, clientId: string): Promise<Permission> {
        const client: Client = await this.clientRepository.find(clientId);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        return this.permissionRepository.find(name, clientId);
    }

    public async listByClientId(username: string, clientId: string): Promise<Permission[]> {
        const client: Client = await this.clientRepository.find(clientId);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        return this.permissionRepository.listByClientId(clientId);
    }
}
