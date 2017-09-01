// Imports
import { IKetoneUserRepository } from './../ketone-user';

// Imports models
import { KetoneUser } from './../../entities/ketone-user';

export class KetoneUserRepository implements IKetoneUserRepository {

    private users: KetoneUser[] = [];

    public async create(user: KetoneUser): Promise<boolean> {

        this.users.push(user);

        return true;
    }

    public async update(user: KetoneUser): Promise<boolean> {
        const existingUser: KetoneUser = this.users.find((x) => x.username === user.username);

        return true;
    }

    public async find(username: string): Promise<KetoneUser> {
        return this.users.find((x) => x.username === username);
    }

    public async list(): Promise<KetoneUser[]> {
        return this.users;
    }

    public async findByAPIKey(apiKey: string): Promise<KetoneUser> {
        return null;
    }
}
