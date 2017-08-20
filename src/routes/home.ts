// Imports
import * as express from 'express';

export class HomeRouter {

    public static index(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        res.render('home', {
            title: 'Home',
            user: req.user,
        });
    }
}
