// Imports
import { BaseRepository } from './base';

// Imports models
import { User } from './../../entities/user';

export class UserRepository extends BaseRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(user: User, clientId: string): Promise<boolean> {

        const client: any = await BaseRepository.models.Client.find({
            where: {
                key: clientId,
            },
        });

        await BaseRepository.models.User.create({
            clientId: client.id,
            emailAddress: user.emailAddress,
            enabled: user.enabled,
            password: user.password,
            profileImage: user.profileImage,
            username: user.username,
            verified: user.verified,
        });

        return true;
    }

    public async update(user: User, clientId: string): Promise<boolean> {
        const existingUser: any = await BaseRepository.models.User.find({
            include: [
                { model: BaseRepository.models.Client, required: false },
            ],
            where: {
                '$client.key$': clientId,
                'username': user.username,
            },
        });

        if (!user) {
            return false;
        }

        existingUser.password = user.password;
        existingUser.verified = user.verified;

        existingUser.save();

        return true;
    }

    public async find(username: string, clientId: string): Promise<User> {
        const user: any = await BaseRepository.models.User.find({
            include: [
                { model: BaseRepository.models.Client, required: false },
            ],
            where: {
                '$client.key$': clientId,
                username,
            },
        });

        if (!user) {
            return null;
        }

        return new User(user.username, user.emailAddress, user.password, user.verified, user.enabled, user.profileImage);
    }

    public async list(clientId: string): Promise<User[]> {
        const users: any[] = await BaseRepository.models.User.findAll({
            include: [
                { model: BaseRepository.models.Client, required: false },
            ],
            order: [
                ['username'],
            ],
            where: {
                '$client.key$': clientId,
            },
        });

        return users.map((x) => new User(x.username, x.emailAddress, x.password, x.verified, x.enabled, x.profileImage));
    }
}
