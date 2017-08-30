// Imports repositories
import { IClientRepository } from './../repositories/client';
import { IUserRepository } from './../repositories/user';

// Imports models
import { Client } from './../entities/client';
import { User } from './../entities/user';

export class UserService {

    constructor(private userRepository: IUserRepository, private clientRepository: IClientRepository) {

    }

    public async list(username: string, clientId: string): Promise<User[]> {
        const client: Client = await this.clientRepository.find(clientId);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        return this.userRepository.list(clientId);
    }

    public async find(username: string, userUsername: string, clientId: string): Promise<User> {
        const client: Client = await this.clientRepository.find(clientId);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        return this.userRepository.find(userUsername, clientId);
    }

    public async create(username: string, clientId: string, userUsername: string, emailAdress: string, password: string, enabled: boolean): Promise<User> {

        const client: Client = await this.clientRepository.find(clientId);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        const user: User = await this.userRepository.find(userUsername, clientId);

        if (user) {
            return null;
        }

        const newUser: User = new User(userUsername, emailAdress, password, false, enabled, null);

        await this.userRepository.create(newUser, clientId);

        return newUser;
    }

    public async update(username: string, userUsername: string, clientId: string, enabled: boolean): Promise<User> {

        const client: Client = await this.clientRepository.find(clientId);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        const user: User = await this.userRepository.find(userUsername, clientId);

        if (!user) {
            return null;
        }

        user.enabled = enabled;

        await this.userRepository.update(user, clientId);

        return user;
    }
}
