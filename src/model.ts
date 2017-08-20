// Imports
import { Client as OAuth2FrameworkClient } from 'oauth2-framework';

// Import Repositories
import { BaseRepository } from './repositories/sequelize/base';
import { ClientRepository } from './repositories/sequelize/client';
import { KetoneUserRepository } from './repositories/sequelize/ketone-user';

// Imports models
import { Client } from './entities/client';
import { User } from './entities/user';

export class Model {

    private clientRepository: ClientRepository = null;
    private ketoneUserRepository: KetoneUserRepository = null;

    constructor() {
        const host = 'developersworkspace.co.za';
        const username = 'ketone';
        const password = 'ZiLSLzrIVhCrcdN6';

        this.clientRepository = new ClientRepository(host, username, password);
        this.ketoneUserRepository = new KetoneUserRepository(host, username, password);
    }

    public async findClient(clientId: string): Promise<OAuth2FrameworkClient> {
        return this.clientRepository.find(clientId);
    }

    public async register(clientId: string, emailAddress: string, username: string, password: string): Promise<boolean> {
        const client: Client = await this.clientRepository.find(clientId);

        if (clientId === 'fLTSn80KPQNOPCS2R7dq') {
            const user: User = await this.ketoneUserRepository.find(username);

            if (user) {
                return false;
            }

            await this.ketoneUserRepository.create(new User(
                username,
                emailAddress,
                password,
                false,
            ));

            return true;
        } else {
            return false;
        }
    }

    public async resetPassword(clientId: string, username: string, password: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    public async sendForgotPasswordEmail(clientId: string, username: string, resetPasswordUrl: string): Promise<boolean> {

        // TODO: Send email via STMP, SendGrid or Mandrill

        return Promise.resolve(true);
    }

    public async sendVerificationEmail(clientId: string, emailAddress: string, username: string, verificationUrl: string): Promise<boolean> {

        // TODO: Send email via STMP, SendGrid or Mandrill

        return Promise.resolve(true);
    }

    public async validateCredentials(clientId: string, username: string, password: string): Promise<boolean> {
        if (clientId === 'fLTSn80KPQNOPCS2R7dq') {
            const user: User = await this.ketoneUserRepository.find(username);

            if (!user) {
                return false;
            }

            if (user.verified && user.password === password) {
                return true;
            }

            return false;
        } else {
            return false;
        }
    }

    public async verify(clientId: string, username: string): Promise<boolean> {
        return Promise.resolve(true);
    }
}
