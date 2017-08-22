// Imports repositories
import { ClientRepository } from './../repositories/sequelize/client';
import { UserRepository } from './../repositories/sequelize/user';

// Imports models
import { Client } from './../entities/client';
import { User } from './../entities/user';

export class UserService {

    constructor(private userRepository: UserRepository, private clientRepository: ClientRepository) {

    }

    public list(clientId: string): Promise<User[]> {
        return this.userRepository.list(clientId);
    }

    public find(username: string, clientId: string): Promise<User> {
        return this.userRepository.find(username, clientId);
    }

    public async create(username: string, clientId: string, userUsername: string, emailAdress: string, password: string, enabled: boolean): Promise<User> {
        const user: User = await this.userRepository.find(userUsername, clientId);

        if (user) {
            return null;
        }

        const client: Client = await this.clientRepository.find(clientId);

        if (!client) {
            return null;
        }

        if (client.username !== username) {
            return null;
        }

        const newUser: User = new User(userUsername, emailAdress, password, false, enabled, null);

        await this.userRepository.create(newUser, clientId);

        return newUser;
    }

    public async update(username: string, clientId: string, enabled: boolean): Promise<User> {
        const user: User = await this.userRepository.find(username, clientId);

        if (!user) {
            return null;
        }

        user.enabled = enabled;

        await this.userRepository.update(user, clientId);

        return user;
    }
}
