// Imports
import * as express from 'express';

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

        res.render('clients', {
            clients,
            title: 'Clients',
            user: req.user,
        });
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
