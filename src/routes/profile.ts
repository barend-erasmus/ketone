// Imports
import * as express from 'express';
import { config } from './../config';

// Imports repositories
import { KetoneUserRepository } from './../repositories/sequelize/ketone-user';

// Imports services
import { KetoneUserService } from './../services/ketone-user';

// Imports models
import { KetoneUser } from './../entities/ketone-user';

export class ProfileRouter {

    public static async editGet(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        const editUser: KetoneUser = await ProfileRouter.getUserService().find(req.user);

        res.render('profile/edit', {
            editUser,
            title: 'Profile - Edit',
            user: req.user,
        });
    }

    // public static async editPost(req: express.Request, res: express.Response) {
    //     if (!req.user) {
    //         res.redirect('/auth/login');
    //         return;
    //     }

    //     const client: Client = await UsersRouter.getClientService().find(req.user, req.body.clientId);

    //     const editUser: User = await UsersRouter.getUserService().update(req.user, req.body.username, req.body.clientId, req.body.enabled ? true : false);

    //     res.render('users/edit', {
    //         client,
    //         editUser,
    //         title: 'Users - Edit',
    //         user: req.user,
    //     });
    // }

    protected static getUserService(): KetoneUserService {

        const userRepository: KetoneUserRepository = new KetoneUserRepository(config.database.host, config.database.username, config.database.password);

        const userService: KetoneUserService = new KetoneUserService(userRepository);

        return userService;
    }
}
