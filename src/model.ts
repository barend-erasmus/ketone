// Imports
import { Client as OAuth2FrameworkClient } from 'oauth2-framework';
import * as yargs from 'yargs';
import { config } from './config';
import * as uuid from 'uuid';

// Import Repositories
import { BaseRepository } from './repositories/sequelize/base';
import { ClientRepository } from './repositories/sequelize/client';
import { EventRepository } from './repositories/sequelize/event';
import { KetoneUserRepository } from './repositories/sequelize/ketone-user';
import { UserRepository } from './repositories/sequelize/user';

// Imports services
import { EmailService } from './services/email';

// Imports models
import { Client } from './entities/client';
import { Event } from './entities/event';

import { User } from './entities/user';
import { KetoneUser } from './entities/ketone-user';

const argv = yargs.argv;

export class Model {

    private clientRepository: ClientRepository = null;
    private ketoneUserRepository: KetoneUserRepository = null;
    private userRepository: UserRepository = null;
    private eventRepository: EventRepository = null;

    private emailService: EmailService = null;

    constructor() {
        this.clientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);
        this.ketoneUserRepository = new KetoneUserRepository(config.database.host, config.database.username, config.database.password);
        this.userRepository = new UserRepository(config.database.host, config.database.username, config.database.password);
        this.eventRepository = new EventRepository(config.database.host, config.database.username, config.database.password);

        this.emailService = new EmailService();
    }

    public async findClient(clientId: string): Promise<OAuth2FrameworkClient> {
        return this.clientRepository.find(clientId);
    }

    public async register(clientId: string, emailAddress: string, username: string, password: string): Promise<boolean> {

        const client: Client = await this.clientRepository.find(clientId);

        if (client.isKetoneClient) {
            const user: User = await this.ketoneUserRepository.find(username);

            if (user) {
                throw new Error('Username already exist');
            }

            await this.ketoneUserRepository.create(new KetoneUser(
                username,
                emailAddress,
                password,
                false,
                true,
                null,
                this.generateApiKey(),
            ));
        } else {
            const user: User = await this.userRepository.find(username, clientId);

            if (user) {
                throw new Error('Username already exist');
            }

            await this.userRepository.create(new User(
                username,
                emailAddress,
                password,
                false,
                true,
                null,
            ), clientId);
        }

        await this.eventRepository.create(new Event(clientId, username, 'register'));

        return true;
    }

    public async resetPassword(clientId: string, username: string, password: string): Promise<boolean> {

        const client: Client = await this.clientRepository.find(clientId);

        let result: boolean;

        if (client.isKetoneClient) {
            const user: KetoneUser = await this.ketoneUserRepository.find(username);

            if (!user) {
                throw new Error('Username does not exist');
            }

            user.password = password;

            result = await this.ketoneUserRepository.update(user);
        } else {
            const user: User = await this.userRepository.find(username, clientId);

            if (!user) {
                throw new Error('Username does not exist');
            }

            user.password = password;

            result = await this.userRepository.update(user, clientId);
        }

        await this.eventRepository.create(new Event(clientId, username, 'resetPassword'));

        return result;
    }

    public async sendForgotPasswordEmail(clientId: string, username: string, resetPasswordUrl: string): Promise<boolean> {

        const client: Client = await this.clientRepository.find(clientId);

        let emailAddress: string;

        if (client.isKetoneClient) {
            const user: KetoneUser = await this.ketoneUserRepository.find(username);

            if (!user) {
                throw new Error('Username does not exist');
            }

            emailAddress = user.emailAddress;
        } else {
            const user: User = await this.userRepository.find(username, clientId);

            if (!user) {
                throw new Error('Username does not exist');
            }

            emailAddress = user.emailAddress;
        }

        const domain = argv.prod ? `${config.domain}/auth` : 'http://localhost:3000/auth';

        const subject = `${client.name} - Forgot Password`;
        const html = `<div> We heard that you lost your ${client.name}  password. Sorry about that!<br><br>But don’t worry! You can use the following link within the next day to reset your password:<br><br><a href="${domain}${resetPasswordUrl}" target="_blank">Reset Password</a><br><br>If you don’t use this link within 3 hours, it will expire.<br><br>Thanks,<br>Your friends at ${client.name} <div class="yj6qo"></div><div class="adL"><br></div></div>`;

        await this.eventRepository.create(new Event(clientId, username, 'sendForgotPasswordEmail'));

        return this.emailService.sendEmail(emailAddress, subject, html);
    }

    public async sendVerificationEmail(clientId: string, emailAddress: string, username: string, verificationUrl: string): Promise<boolean> {

        const client: Client = await this.clientRepository.find(clientId);

        const domain = argv.prod ? `${config.domain}/auth` : 'http://localhost:3000/auth';

        const subject = `${client} - Verification`;
        const html = `<div> Thank you for registering on ${client}. <br><br><a href="${domain}${verificationUrl}" target="_blank">Verify Email</a> <br><br>If you don’t use this link within 3 hours, it will expire. <br><br>Thanks,<br>Your friends at ${client} <div class="yj6qo"></div><div class="adL"><br></div></div>`;

        await this.eventRepository.create(new Event(clientId, username, 'sendVerificationEmail'));

        return this.emailService.sendEmail(emailAddress, subject, html);
    }

    public async validateCredentials(clientId: string, username: string, password: string): Promise<boolean> {

        const client: Client = await this.clientRepository.find(clientId);

        let result: boolean = false;

        if (client.isKetoneClient) {
            const user: User = await this.ketoneUserRepository.find(username);

            if (!user) {
                return false;
            }

            if (user.verified && user.password === password && user.enabled) {
                result = true;
            }
        } else {
            const user: User = await this.userRepository.find(username, clientId);

            if (!user) {
                return false;
            }

            if (user.password === password && user.enabled) {
                result = true;
            }
        }

        await this.eventRepository.create(new Event(clientId, username, 'validateCredentials'));

        return result;
    }

    public async verify(clientId: string, username: string): Promise<boolean> {

        const client: Client = await this.clientRepository.find(clientId);

        let result: boolean;

        if (client.isKetoneClient) {
            const user: KetoneUser = await this.ketoneUserRepository.find(username);

            if (!user) {
                return false;
            }

            user.verified = true;

            result = await this.ketoneUserRepository.update(user);
        } else {
            const user: User = await this.userRepository.find(username, clientId);

            if (!user) {
                return false;
            }

            user.verified = true;

            result = await this.userRepository.update(user, clientId);
        }

        await this.eventRepository.create(new Event(clientId, username, 'verify'));

        return result;
    }

    private generateApiKey(): string {
        return uuid.v4();
    }
}
