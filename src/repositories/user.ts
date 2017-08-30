// Imports models
import { User } from './../entities/user';

export interface IUserRepository {

    create(user: User, clientId: string): Promise<boolean>;

    update(user: User, clientId: string): Promise<boolean>;

    find(username: string, clientId: string): Promise<User>;

    list(clientId: string): Promise<User[]>;
}
