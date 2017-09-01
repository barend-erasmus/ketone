// Imports
import * as uuid from 'uuid';
import * as crypto from 'crypto';
import { config } from './../config';

// Imports repositories
import { IClientRepository } from './../repositories/client';
import { IUserRepository } from './../repositories/user';
import { IKetoneUserRepository } from './../repositories/ketone-user';

// Imports models
import { Client } from './../entities/client';
import { User } from './../entities/user';
import { KetoneUser } from './../entities/ketone-user';

export class UserService {

    constructor(private userRepository: IUserRepository,
        private ketoneUserRepository: IKetoneUserRepository,
        private clientRepository: IClientRepository) {

    }

    public async list(username: string, clientId: string): Promise<User[]> {
        const client: Client = await this.clientRepository.find(clientId);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        if (client.isKetoneClient) {
            return this.ketoneUserRepository.list();
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

        if (client.isKetoneClient) {
            return this.ketoneUserRepository.find(userUsername);
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

        password = crypto.createHash('md5').update(`${config.salt}_${password}_${config.salt}`).digest("hex");

        if (client.isKetoneClient) {

            const user: KetoneUser = await this.ketoneUserRepository.find(userUsername);

            if (user) {
                return null;
            }

            const newUser: KetoneUser = new KetoneUser(userUsername, emailAdress, password, false, enabled, null, this.generateApiKey());

            await this.ketoneUserRepository.create(newUser);

            return newUser;

        } else {

            const user: User = await this.userRepository.find(userUsername, clientId);

            if (user) {
                return null;
            }

            const newUser: User = new User(userUsername, emailAdress, password, false, enabled, null);

            await this.userRepository.create(newUser, clientId);

            return newUser;
        }
    }

    public async update(username: string, userUsername: string, clientId: string, enabled: boolean): Promise<User> {

        const client: Client = await this.clientRepository.find(clientId);

        if (!client) {
            throw new Error('Invalid Client Id');
        }

        if (!client.isOwner(username)) {
            throw new Error('You are not the owner of this Client Id');
        }

        if (client.isKetoneClient) {

            const user: KetoneUser = await this.ketoneUserRepository.find(userUsername);

            if (!user) {
                return null;
            }

            user.enabled = enabled;

            await this.ketoneUserRepository.update(user);

            return user;

        } else {

            const user: User = await this.userRepository.find(userUsername, clientId);

            if (!user) {
                return null;
            }

            user.enabled = enabled;

            await this.userRepository.update(user, clientId);

            return user;
        }
    }

    private generateApiKey(): string {
        return uuid.v4();
    }
}
