// Imports
import { IUserRepository } from './../user';

// Imports models
import { User } from './../../entities/user';

export class UserRepository implements IUserRepository {

    private users: {} = {};

    public async create(user: User, clientId: string): Promise<boolean> {

        if (this.users[clientId]) {
            this.users[clientId].push(user);
        } else {
            this.users[clientId] = [user];
        }

        return true;
    }

    public async update(user: User, clientId: string): Promise<boolean> {
        const existingUser: User = this.users[clientId].find((x) => x.username === user.username);;

        return true;
    }

    public async find(username: string, clientId: string): Promise<User> {
        return this.users[clientId] ? this.users[clientId].find((x) => x.username === username) : null;
    }

    public async list(clientId: string): Promise<User[]> {
        return this.users[clientId];
    }
}
