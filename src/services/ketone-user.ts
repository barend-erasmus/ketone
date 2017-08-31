// Imports repositories
import { IClientRepository } from './../repositories/client';
import { IKetoneUserRepository } from './../repositories/ketone-user';

// Imports models
import { KetoneUser } from './../entities/ketone-user';

export class KetoneUserService {

    constructor(private userRepository: IKetoneUserRepository) {

    }

    public async findByAPIKey(apiKey: string): Promise<KetoneUser> {
        return this.userRepository.findByAPIKey(apiKey);
    }
}
