// Imports
import * as express from 'express';
import * as yargs from 'yargs';
import { config } from './../config';

// Imports services
import { EmailService } from './../services/email';

const argv = yargs.argv;

export class ContactRouter {

    public static async send(req: express.Request, res: express.Response) {
        const emailService = new EmailService();

        await emailService.sendEmail('developersworkspace@gmail.com', `Ketone - ${req.body.name} - ${req.body.email}`, req.body.message);

        res.json(true);
    }
}
