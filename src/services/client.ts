// Imports repositories
import { ClientRepository } from './../repositories/sequelize/client';

// Imports models
import { Client } from './../entities/client';

export class ClientService {
    constructor(private clientRepository: ClientRepository) {

    }

    public async list(username: string): Promise<Client[]> {
        return this.clientRepository.listByUsername(username);
    }

    public async find(username: string, id: string): Promise<Client> {
        const client: Client = await this.clientRepository.find(id);
        
        if (!client) {
            return null;
        }

        if (client.username !== username) {
            return null;
        }

        return client;
    }
}
