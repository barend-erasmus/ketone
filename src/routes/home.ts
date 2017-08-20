// Imports
import * as express from 'express';

export class HomeRouter {

    public static async index(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        res.render('home/index', {
            title: 'Home',
            user: req.user,
        });
    }
}
