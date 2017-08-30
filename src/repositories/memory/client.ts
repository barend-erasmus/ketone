// Imports
import { IClientRepository } from './../client';

// Imports models
import { Client } from './../../entities/client';

export class ClientRepository implements IClientRepository {

    private clients: Client[] = [];

    public async create(client: Client): Promise<boolean> {
        this.clients.push(client);
        return true;
    }

    public async find(id: string): Promise<Client> {
        return this.clients.find((x) => x.id === id);
    }

    public async update(client: Client): Promise<boolean> {

        const existingClient: Client = this.clients.find((x) => x.id === client.id);

        return true;
    }

    public async listByUsername(username: string): Promise<Client[]> {
        return this.clients.filter((x) => x.username === username);
    }
}
