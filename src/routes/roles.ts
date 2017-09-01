// Imports
import * as express from 'express';
import { config } from './../config';

// Imports repositories
import { ClientRepository } from './../repositories/sequelize/client';
import { RoleRepository } from './../repositories/sequelize/role';

// Imports services
import { ClientService } from './../services/client';
import { RoleService } from './../services/role';

// Imports models
import { Client } from './../entities/client';
import { Role } from './../entities/role';

export class RolesRouter {

    public static async index(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        if (!req.query.clientId) {
            res.status(404).render('error/NotFound', { layout: false });
            return;
        }

        const client: Client = await RolesRouter.getClientService().find(req.user, req.query.clientId);

        const roles: Role[] = await RolesRouter.getRoleService().listByClientId(req.user, req.query.clientId);

        res.render('roles/index', {
            client,
            roles,
            title: 'Roles',
            user: req.user,
        });
    }

    protected static getRoleService(): RoleService {

        const roleRepository: RoleRepository = new RoleRepository(config.database.host, config.database.username, config.database.password);
        const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);

        const roleService: RoleService = new RoleService(roleRepository, clientRepository);

        return roleService;
    }

    protected static getClientService(): ClientService {

        const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);

        const clientService: ClientService = new ClientService(clientRepository);

        return clientService;
    }
}
