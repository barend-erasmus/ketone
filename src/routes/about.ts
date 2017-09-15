// Imports
import * as express from 'express';
import * as yargs from 'yargs';
import { config } from './../config';

const argv = yargs.argv;

export class AboutRouter {

    public static async index(req: express.Request, res: express.Response) {
        res.render('about/index', {
            domain: argv.prod ? config.domain : 'http://localhost:3000',
            layout: false,
        });
    }
}
