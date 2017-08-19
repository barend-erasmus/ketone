// Imports
import { Client } from 'oauth2-framework';

export class Model {

    public async findClient(clientId: string): Promise<Client> {
        return Promise.resolve(new Client(
            'Ketone',
            '0zyrWYATtw',
            'x3h8CTB2Cj',
            [], [
                'http://localhost:4200/#/callback',
                'http://parkingapp.euromonitor.local/web/#/callback'
            ],
            true,
            true,
        ));
    }

    public async register(client_id: string, emailAddress: string, username: string, password: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    public async resetPassword(client_id: string, username: string, password: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    public async sendForgotPasswordEmail(client_id: string, username: string, resetPasswordUrl: string): Promise<boolean> {

        // TODO: Send email via STMP, SendGrid or Mandrill

        return Promise.resolve(true);
    }

    public async sendVerificationEmail(client_id: string, emailAddress: string, username: string, verificationUrl: string): Promise<boolean> {

        // TODO: Send email via STMP, SendGrid or Mandrill

        return Promise.resolve(true);
    }

    public async validateCredentials(client_id: string, username: string, password: string): Promise<boolean> {
        if (username.toLowerCase() === 'demo' && password === '123456') {
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }

    public async verify(client_id: string, username: string): Promise<boolean> {
        return Promise.resolve(true);
    }
}