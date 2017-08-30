// Imports
import * as express from 'express';
import { config } from './../../config';

// Imports repositories
import { ClientRepository } from './../../repositories/sequelize/client';
import { UserRepository } from './../../repositories/sequelize/user';

// Imports services
import { ClientService } from './../../services/client';
import { UserService } from './../../services/user';

// Imports models
import { Client } from './../../entities/client';
import { User } from './../../entities/user';

export class APIUsersRouter {

    public static async index(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        const users: User[] = await APIUsersRouter.getUserService().list(req.user, req.query.clientId);

        res.json(users);
    }

    protected static getUserService(): UserService {
        const host = 'developersworkspace.co.za';
        const username = 'ketone';
        const password = 'ZiLSLzrIVhCrcdN6';

        const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);
        const userRepository: UserRepository = new UserRepository(config.database.host, config.database.username, config.database.password);

        const userService: UserService = new UserService(userRepository, clientRepository);

        return userService;
    }
}
