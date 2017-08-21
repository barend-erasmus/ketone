// Imports
import * as express from 'express';

// Imports repositories
import { ClientRepository } from './../repositories/sequelize/client';
import { UserRepository } from './../repositories/sequelize/user';

// Imports services
import { ClientService } from './../services/client';
import { UserService } from './../services/user';

// Imports models
import { Client } from './../entities/client';
import { User } from './../entities/user';

export class UsersRouter {

    public static async index(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        if (!req.query.clientId) {
            res.render('error/NotFound', { layout: false });
            return;
        }

        const client: Client = await UsersRouter.getClientService().find(req.user, req.query.clientId);

        const users: User[] = await UsersRouter.getUserService().list(req.query.clientId);

        res.render('users/index', {
            client,
            title: 'Users',
            user: req.user,
            users,
        });
    }

    public static async editGet(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        if (!req.query.username) {
            res.render('error/NotFound', { layout: false });
            return;
        }

        if (!req.query.clientId) {
            res.render('error/NotFound', { layout: false });
            return;
        }

        const client: Client = await UsersRouter.getClientService().find(req.user, req.query.clientId);

        const editUser: User = await UsersRouter.getUserService().find(req.query.username, req.query.clientId);

        res.render('users/edit', {
            client,
            editUser,
            title: 'Users - Edit',
            user: req.user,
        });
    }

    public static async editPost(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        const client: Client = await UsersRouter.getClientService().find(req.user, req.body.clientId);

        const editUser: User = await UsersRouter.getUserService().update(req.body.username, req.body.clientId, req.body.enabled ? true : false);

        res.render('users/edit', {
            client,
            editUser,
            title: 'Users - Edit',
            user: req.user,
        });
    }

    protected static getUserService(): UserService {
        const host = 'developersworkspace.co.za';
        const username = 'ketone';
        const password = 'ZiLSLzrIVhCrcdN6';

        const userRepository: UserRepository = new UserRepository(host, username, password);

        const userService: UserService = new UserService(userRepository);

        return userService;
    }

    protected static getClientService(): ClientService {
        const host = 'developersworkspace.co.za';
        const username = 'ketone';
        const password = 'ZiLSLzrIVhCrcdN6';

        const clientRepository: ClientRepository = new ClientRepository(host, username, password);

        const clientService: ClientService = new ClientService(clientRepository);

        return clientService;
    }
}
