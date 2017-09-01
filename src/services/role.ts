// Imports
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import { config } from './../config';

// Imports repositories
import { IClientRepository } from './../repositories/client';
import { IRoleRepository } from './../repositories/role';

// Imports models
import { Client } from './../entities/client';
import { Role } from './../entities/role';

export class RoleService {

    constructor(private roleRepository: IRoleRepository,
                private clientRepository: IClientRepository) {

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
}
