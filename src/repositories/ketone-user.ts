// Imports models
import { KetoneUser } from './../entities/ketone-user';

export interface IKetoneUserRepository {

    create(user: KetoneUser): Promise<boolean>;

    update(user: KetoneUser): Promise<boolean>;

    find(username: string): Promise<KetoneUser>;

    findByAPIKey(apiKey: string): Promise<KetoneUser>;
}
