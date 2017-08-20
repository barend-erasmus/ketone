// Imports repositories
import { ClientRepository } from './../repositories/sequelize/client';

// Imports models
import { Client } from './../entities/client';

export class ClientService {
    constructor(private clientRepository: ClientRepository) {

    }

    public list(username: string): Promise<Client[]> {
        return this.clientRepository.listByUsername(username);
    }
}
