// Imports
import * as express from 'express';
import { config } from './../config';

// Imports repositories
import { ClientRepository } from './../repositories/sequelize/client';

// Imports services
import { ClientService } from './../services/client';

// Imports models
import { Client } from './../entities/client';

export class ClientsRouter {

    public static async index(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        const clients: Client[] = await ClientsRouter.getClientService().list(req.user);

        res.render('clients/index', {
            clients,
            title: 'Clients',
            user: req.user,
        });
    }

    public static async editGet(req: express.Request, res: express.Response) {
        try {
            if (!req.user) {
                res.redirect('/auth/login');
                return;
            }

            if (!req.query.id) {
                res.status(404).render('error/NotFound', { layout: false });
                return;
            }

            const client: Client = await ClientsRouter.getClientService().find(req.user, req.query.id);

            if (!client) {
                res.status(404).render('error/NotFound', { layout: false });
                return;
            }

            res.render('clients/edit', {
                client,
                title: 'Clients - Edit',
                user: req.user,
            });

        } catch (err) {
            res.status(500).render('error/InternalServerError', { layout: false, message: err.message });
        }
    }

    public static async editPost(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        const client: Client = await ClientsRouter.getClientService().update(req.user, req.body.id, req.body.name, req.body.allowForgotPassword ? true : false, req.body.allowRegister ? true : false);

        if (!client) {
            res.status(500).render('error/InternalServerError', { layout: false });
            return;
        }

        res.render('clients/edit', {
            client,
            title: 'Clients - Edit',
            user: req.user,
        });
    }

    public static async addScope(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        const client: Client = await ClientsRouter.getClientService().addScope(req.user, req.body.id, req.body.name);

        res.redirect(`/clients/edit?id=${client.id}`);
    }

    public static async removeScope(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        const client: Client = await ClientsRouter.getClientService().removeScope(req.user, req.query.id, req.query.name);

        res.redirect(`/clients/edit?id=${client.id}`);
    }

    public static async addRedirectUri(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        const client: Client = await ClientsRouter.getClientService().addRedirectUri(req.user, req.body.id, req.body.uri);

        res.redirect(`/clients/edit?id=${client.id}`);
    }

    public static async removeRedirectUri(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        const client: Client = await ClientsRouter.getClientService().removeRedirectUri(req.user, req.query.id, req.query.uri);

        res.redirect(`/clients/edit?id=${client.id}`);
    }

    public static async createGet(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        res.render('clients/create', {
            title: 'Clients - Create',
            user: req.user,
        });
    }

    public static async createPost(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        const client: Client = await ClientsRouter.getClientService().create(req.user, req.body.name);

        res.redirect(`/clients/edit?id=${client.id}`);
    }

    protected static getClientService(): ClientService {

        const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);

        const clientService: ClientService = new ClientService(clientRepository);

        return clientService;
    }
}
