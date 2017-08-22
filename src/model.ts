// Imports
import { Client as OAuth2FrameworkClient } from 'oauth2-framework';
import * as yargs from 'yargs';

// Import Repositories
import { BaseRepository } from './repositories/sequelize/base';
import { ClientRepository } from './repositories/sequelize/client';
import { KetoneUserRepository } from './repositories/sequelize/ketone-user';
import { UserRepository } from './repositories/sequelize/user';

// Imports services
import { EmailService } from './services/email';

// Imports models
import { Client } from './entities/client';
import { User } from './entities/user';

const argv = yargs.argv;

export class Model {

    private clientRepository: ClientRepository = null;
    private ketoneUserRepository: KetoneUserRepository = null;
    private userRepository: UserRepository = null;

    private emailService: EmailService = null;

    constructor() {
        const host = 'developersworkspace.co.za';
        const username = 'ketone';
        const password = 'ZiLSLzrIVhCrcdN6';

        this.clientRepository = new ClientRepository(host, username, password);
        this.ketoneUserRepository = new KetoneUserRepository(host, username, password);
        this.userRepository = new UserRepository(host, username, password);

        this.emailService = new EmailService();
    }

    public async findClient(clientId: string): Promise<OAuth2FrameworkClient> {
        return this.clientRepository.find(clientId);
    }

    public async register(clientId: string, emailAddress: string, username: string, password: string): Promise<boolean> {
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
                true,
                null,
            ));

            return true;
        } else {
            const user: User = await this.userRepository.find(username, clientId);

            if (user) {
                return false;
            }

            await this.userRepository.create(new User(
                username,
                emailAddress,
                password,
                false,
                true,
                null,
            ), clientId);

            return true;
        }
    }

    public async resetPassword(clientId: string, username: string, password: string): Promise<boolean> {
        if (clientId === 'fLTSn80KPQNOPCS2R7dq') {
            const user: User = await this.ketoneUserRepository.find(username);

            if (!user) {
                return false;
            }

            user.password = password;

            return this.ketoneUserRepository.update(user);
        } else {
            const user: User = await this.userRepository.find(username, clientId);

            if (!user) {
                return false;
            }

            user.password = password;

            return this.userRepository.update(user, clientId);
        }
    }

    public async sendForgotPasswordEmail(clientId: string, username: string, resetPasswordUrl: string): Promise<boolean> {
        if (clientId === 'fLTSn80KPQNOPCS2R7dq') {
            const user: User = await this.ketoneUserRepository.find(username);

            if (!user) {
                return false;
            }

            const domain = argv.prod ? 'https://ketone.openservices.co.za/auth' : 'http://localhost:3000/auth';

            const subject = 'Ketone - Forgot Password';
            const html = `<div> We heard that you lost your Ketone password. Sorry about that!<br><br>But don’t worry! You can use the following link within the next day to reset your password:<br><br><a href="${domain}${resetPasswordUrl}" target="_blank">Reset Password</a><br><br>If you don’t use this link within 3 hours, it will expire.<br><br>Thanks,<br>Your friends at Ketone <div class="yj6qo"></div><div class="adL"><br></div></div>`;

            return this.emailService.sendEmail(user.emailAddress, subject, html);
        } else {
            const user: User = await this.userRepository.find(username, clientId);

            if (!user) {
                return false;
            }

            const domain = argv.prod ? 'https://ketone.openservices.co.za/auth' : 'http://localhost:3000/auth';

            const subject = 'Ketone - Forgot Password';
            const html = `<div> We heard that you lost your Ketone password. Sorry about that!<br><br>But don’t worry! You can use the following link within the next day to reset your password:<br><br><a href="${domain}${resetPasswordUrl}" target="_blank">Reset Password</a><br><br>If you don’t use this link within 3 hours, it will expire.<br><br>Thanks,<br>Your friends at Ketone <div class="yj6qo"></div><div class="adL"><br></div></div>`;

            return this.emailService.sendEmail(user.emailAddress, subject, html);
        }
    }

    public async sendVerificationEmail(clientId: string, emailAddress: string, username: string, verificationUrl: string): Promise<boolean> {
        if (clientId === 'fLTSn80KPQNOPCS2R7dq') {
            const domain = argv.prod ? 'https://ketone.openservices.co.za/auth' : 'http://localhost:3000/auth';

            const subject = 'Ketone - Verification';
            const html = `<div> Thank you for registering on Ketone. <br><br><a href="${domain}${verificationUrl}" target="_blank">Verify Email</a> <br><br>If you don’t use this link within 3 hours, it will expire. <br><br>Thanks,<br>Your friends at Ketone <div class="yj6qo"></div><div class="adL"><br></div></div>`;

            return this.emailService.sendEmail(emailAddress, subject, html);
        } else {
            const domain = argv.prod ? 'https://ketone.openservices.co.za/auth' : 'http://localhost:3000/auth';

            const subject = 'Ketone - Verification';
            const html = `<div> Thank you for registering on Ketone. <br><br><a href="${domain}${verificationUrl}" target="_blank">Verify Email</a> <br><br>If you don’t use this link within 3 hours, it will expire. <br><br>Thanks,<br>Your friends at Ketone <div class="yj6qo"></div><div class="adL"><br></div></div>`;

            return this.emailService.sendEmail(emailAddress, subject, html);
        }
    }

    public async validateCredentials(clientId: string, username: string, password: string): Promise<boolean> {
        if (clientId === 'fLTSn80KPQNOPCS2R7dq') {
            const user: User = await this.ketoneUserRepository.find(username);

            if (!user) {
                return false;
            }

            if (user.verified && user.password === password && user.enabled) {
                return true;
            }

            return false;
        } else {
            const user: User = await this.userRepository.find(username, clientId);

            if (!user) {
                return false;
            }

            if (user.password === password && user.enabled) {
                return true;
            }

            return false;
        }
    }

    public async verify(clientId: string, username: string): Promise<boolean> {
        if (clientId === 'fLTSn80KPQNOPCS2R7dq') {
            const user: User = await this.ketoneUserRepository.find(username);

            if (!user) {
                return false;
            }

            user.verified = true;

            return this.ketoneUserRepository.update(user);
        } else {
            const user: User = await this.userRepository.find(username, clientId);

            if (!user) {
                return false;
            }

            user.verified = true;

            return this.userRepository.update(user, clientId);
        }
    }
}
