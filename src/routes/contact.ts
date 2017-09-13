// Imports
import * as express from 'express';
import { config } from './../config';
import * as yargs from 'yargs';

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
