// Imports
import { BaseRepository } from './base';
import { IKetoneUserRepository } from './../ketone-user';

// Imports models
import { KetoneUser } from './../../entities/ketone-user';

export class KetoneUserRepository extends BaseRepository implements IKetoneUserRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(user: KetoneUser): Promise<boolean> {
        await BaseRepository.models.KetoneUser.create({
            apiKey: user.apiKey,
            emailAddress: user.emailAddress,
            enabled: user.enabled,
            password: user.password,
            profileImage: user.profileImage,
            username: user.username,
            verified: user.verified,
        });

        return true;
    }

    public async update(user: KetoneUser): Promise<boolean> {
        const existingUser: any = await BaseRepository.models.KetoneUser.find({
            where: {
                username: user.username,
            },
        });

        if (!user) {
            return false;
        }

        existingUser.password = user.password;
        existingUser.verified = user.verified;
        existingUser.enabled = user.enabled;

        await existingUser.save();

        return true;
    }

    public async findByAPIKey(apiKey: string): Promise<KetoneUser> {
        const user: any = await BaseRepository.models.KetoneUser.find({
            where: {
                apiKey,
            },
        });

        if (!user) {
            return null;
        }

        return new KetoneUser(user.username, user.emailAddress, user.password, user.verified, user.enabled, user.profileImage, user.apiKey);
    }

    public async find(username: string): Promise<KetoneUser> {
        const user: any = await BaseRepository.models.KetoneUser.find({
            where: {
                username,
            },
        });

        if (!user) {
            return null;
        }

        return new KetoneUser(user.username, user.emailAddress, user.password, user.verified, user.enabled, user.profileImage, user.apiKey);
    }

    public async list(): Promise<KetoneUser[]> {
        const users: any[] = await BaseRepository.models.KetoneUser.findAll({
            order: [
                ['username'],
            ]
        });

        return users.map((x) => new KetoneUser(x.username, x.emailAddress, x.password, x.verified, x.enabled, x.profileImage, x.apiKey));
    }
}
