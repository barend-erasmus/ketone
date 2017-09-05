// Imports repositories
import { IClientRepository } from './../repositories/client';

// Imports models
import { Client } from './../entities/client';
import { Role } from './../entities/role';
import { RoleGroup } from './../entities/role-group';

export class ClientService {

    constructor(private clientRepository: IClientRepository) {

    }

    public async list(username: string): Promise<Client[]> {
        return this.clientRepository.listByUsername(username);
    }

    public async find(username: string, id: string): Promise<Client> {
        const client: Client = await this.clientRepository.find(id);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        return client;
    }

    public async create(username: string, name: string): Promise<Client> {

        if (!name) {
            throw new Error('Invalid Client Name');
        }

        const client: Client = new Client(name, this.generateToken(), this.generateToken(), [], [], false, false, username, null);

        await this.clientRepository.create(client);

        return client;
    }

    public async update(username: string, id: string, name: string, allowForgotPassword: boolean, allowRegister: boolean, roleName: string, roleGroupName: string): Promise<Client> {
        const client: Client = await this.clientRepository.find(id);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        client.name = name;
        client.allowForgotPassword = allowForgotPassword;
        client.allowRegister = allowRegister;
        client.role = roleName ? new Role(roleName, new RoleGroup(roleGroupName), []) : null;

        await this.clientRepository.update(client);

        return client;
    }

    public async addScope(username: string, id: string, name: string): Promise<Client> {
        const client: Client = await this.clientRepository.find(id);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
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

        if (!client.isOwner(username)) {
            return null;
        }

        client.allowedScopes.splice(client.allowedScopes.indexOf(name), 1);

        await this.clientRepository.update(client);

        return client;
    }

    public async addRedirectUri(username: string, id: string, uri: string): Promise<Client> {
        const client: Client = await this.clientRepository.find(id);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        client.redirectUris.push(uri);

        await this.clientRepository.update(client);

        return client;
    }

    public async removeRedirectUri(username: string, id: string, uri: string): Promise<Client> {
        const client: Client = await this.clientRepository.find(id);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
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
