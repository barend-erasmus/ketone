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

    public async create(username: string, name: string): Promise<Client> {
        const client: Client = new Client(name, this.generateToken(), this.generateToken(), [], [], false, false, username);

        await this.clientRepository.create(client);

        return client;
    }

    public async update(username: string, id: string, name: string, allowForgotPassword: boolean, allowRegister: boolean): Promise<Client> {
        const client: Client = await this.clientRepository.find(id);

        if (!client) {
            return null;
        }

        if (client.username !== username) {
            return null;
        }

        client.name = name;
        client.allowForgotPassword = allowForgotPassword;
        client.allowRegister = allowRegister;

        await this.clientRepository.update(client);

        return client;
    }

    public async addScope(username: string, id: string, name: string): Promise<Client> {
        const client: Client = await this.clientRepository.find(id);

        if (!client) {
            return null;
        }

        if (client.username !== username) {
            return null;
        }

        client.allowedScopes.push(name);

        await this.clientRepository.update(client);

        return client;
    }

    public async removeScope(username: string, id: string, name: string): Promise<Client> {
        const client: Client = await this.clientRepository.find(id);

        if (!client) {
            return null;
        }

        if (client.username !== username) {
            return null;
        }

        client.allowedScopes.splice(client.allowedScopes.indexOf(name), 1);

        await this.clientRepository.update(client);

        return client;
    }

    public async addRedirectUri(username: string, id: string, uri: string): Promise<Client> {
        const client: Client = await this.clientRepository.find(id);

        if (!client) {
            return null;
        }

        if (client.username !== username) {
            return null;
        }

        client.redirectUris.push(uri);

        await this.clientRepository.update(client);

        return client;
    }

    public async removeRedirectUri(username: string, id: string, uri: string): Promise<Client> {
        const client: Client = await this.clientRepository.find(id);

        if (!client) {
            return null;
        }

        if (client.username !== username) {
            return null;
        }

        client.redirectUris.splice(client.redirectUris.indexOf(uri), 1);

        await this.clientRepository.update(client);

        return client;
    }

    private generateToken() {
        let text = "";
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 20; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return text;
    }

}
