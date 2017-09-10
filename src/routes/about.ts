// Imports
import * as express from 'express';

export class AboutRouter {

    public static async index(req: express.Request, res: express.Response) {
        res.render('about/index', {
            layout: false,
        });
    }
}
