// Imports repositories
import { UserRepository } from './../repositories/sequelize/user';

// Imports models
import { User } from './../entities/user';

export class UserService {

    constructor(private userRepository: UserRepository) {

    }

    public list(clientId: string): Promise<User[]> {
        return this.userRepository.list(clientId);
    }

    public find(username: string, clientId: string): Promise<User> {
        return this.userRepository.find(username, clientId);
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
