// Imports
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import { config } from './../config';

// Imports repositories
import { IClientRepository } from './../repositories/client';
import { IKetoneUserRepository } from './../repositories/ketone-user';
import { IUserRepository } from './../repositories/user';

// Imports models
import { Client } from './../entities/client';
import { KetoneUser } from './../entities/ketone-user';
import { Role } from './../entities/role';
import { RoleGroup } from './../entities/role-group';
import { User } from './../entities/user';

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
            const users: KetoneUser[] = await this.ketoneUserRepository.list();
            return users.map((x) => new User(x.username, x.emailAddress, x.password, x.verified, x.enabled, x.profileImage, x.role));
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
            const user: KetoneUser = await this.ketoneUserRepository.find(userUsername);
            return new User(user.username, user.emailAddress, user.apiKey, user.verified, user.enabled, user.profileImage, user.role);
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

            const newUser: KetoneUser = new KetoneUser(userUsername, emailAdress, password, false, enabled, null, this.generateApiKey(), client.role ? client.role : null);

            await this.ketoneUserRepository.create(newUser);

            return new User(newUser.username, newUser.emailAddress, newUser.password, newUser.verified, newUser.enabled, newUser.profileImage, newUser.role);

        } else {

            const user: User = await this.userRepository.find(userUsername, clientId);

            if (user) {
                return null;
            }

            const newUser: User = new User(userUsername, emailAdress, password, false, enabled, null, client.role ? client.role : null);

            await this.userRepository.create(newUser, clientId);

            return newUser;
        }
    }

    public async update(username: string, userUsername: string, clientId: string, enabled: boolean, roleName: string, roleGroupName: string): Promise<User> {

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
            user.role = roleName? new Role(roleName, new RoleGroup(roleGroupName), []) : null;
            
            await this.ketoneUserRepository.update(user);

            return new User(user.username, user.emailAddress, user.password, user.verified, user.enabled, user.profileImage, user.role);

        } else {

            const user: User = await this.userRepository.find(userUsername, clientId);

            if (!user) {
                return null;
            }

            user.enabled = enabled;
            user.role = roleName? new Role(roleName, new RoleGroup(roleGroupName), []) : null;

            await this.userRepository.update(user, clientId);

            return user;
        }
    }

    private generateApiKey(): string {
        return uuid.v4();
    }
}
