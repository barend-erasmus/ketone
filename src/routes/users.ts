// Imports
import * as express from 'express';
import { config } from './../config';

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
            res.status(404).render('error/NotFound', { layout: false });
            return;
        }

        const client: Client = await UsersRouter.getClientService().find(req.user, req.query.clientId);

        const users: User[] = await UsersRouter.getUserService().list(req.user, req.query.clientId);

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
            res.status(404).render('error/NotFound', { layout: false });
            return;
        }

        if (!req.query.clientId) {
            res.status(404).render('error/NotFound', { layout: false });
            return;
        }

        const client: Client = await UsersRouter.getClientService().find(req.user, req.query.clientId);

        const editUser: User = await UsersRouter.getUserService().find(req.user, req.query.username, req.query.clientId);

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

        const editUser: User = await UsersRouter.getUserService().update(req.user, req.body.username, req.body.clientId, req.body.enabled ? true : false);

        res.render('users/edit', {
            client,
            editUser,
            title: 'Users - Edit',
            user: req.user,
        });
    }

    public static async createGet(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        if (!req.query.clientId) {
            res.status(404).render('error/NotFound', { layout: false });
            return;
        }

        const client: Client = await UsersRouter.getClientService().find(req.user, req.query.clientId);

        res.render('users/create', {
            client,
            title: 'Users - Create',
            user: req.user,
        });
    }

    public static async createPost(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        const user: User = await UsersRouter.getUserService().create(req.user, req.body.clientId, req.body.username, req.body.emailAddress, req.body.password, req.body.enabled);

        if (!user) {
            res.status(500).render('error/InternalServerError', { layout: false });
            return;
        }

        res.redirect(`/users/edit?clientId=${req.body.clientId}&username=${user.username}`);
    }

    protected static getUserService(): UserService {
        
        const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);
        const userRepository: UserRepository = new UserRepository(config.database.host, config.database.username, config.database.password);

        const userService: UserService = new UserService(userRepository, clientRepository);

        return userService;
    }

    protected static getClientService(): ClientService {

        const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);

        const clientService: ClientService = new ClientService(clientRepository);

        return clientService;
    }
}
