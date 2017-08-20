// Imports
import { BaseRepository } from './base';

// Imports models
import { User } from './../../entities/user';

export class KetoneUserRepository extends BaseRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(user: User): Promise<boolean> {
        await BaseRepository.models.KetoneUser.create({
            emailAddress: user.emailAddress,
            password: user.password,
            username: user.username,
            verified: user.verified,
        });

        return true;
    }

    public async find(username: string): Promise<User> {
        const user: any = await BaseRepository.models.KetoneUser.find({
            where: {
                username,
            },
        });

        if (!user) {
            return null;
        }

        return new User(user.username, user.emailAddress, user.password, user.verified);
    }
}
