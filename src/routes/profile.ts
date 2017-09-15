// Imports
import * as express from 'express';
import { config } from './../config';
import { BaseRouter } from './base';

// Imports repositories
import { KetoneUserRepository } from './../repositories/sequelize/ketone-user';

// Imports services
import { KetoneUserService } from './../services/ketone-user';

// Imports models
import { KetoneUser } from './../entities/ketone-user';

export class ProfileRouter {

    public static async editGet(req: express.Request, res: express.Response) {

        const editUser: KetoneUser = await ProfileRouter.getUserService().find(req.user.username);

        res.render('profile/edit', {
            baseModel: BaseRouter.getBaseModel(),
            editUser,
            title: 'Profile - Edit',
            user: req.user,
        });
    }

    protected static getUserService(): KetoneUserService {

        const userRepository: KetoneUserRepository = new KetoneUserRepository(config.database.host, config.database.username, config.database.password);

        const userService: KetoneUserService = new KetoneUserService(userRepository);

        return userService;
    }
}
