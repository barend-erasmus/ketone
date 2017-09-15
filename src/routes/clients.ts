// Imports
import * as express from 'express';
import { config } from './../config';
import { BaseRouter } from './base';

// Imports repositories
import { ClientRepository } from './../repositories/sequelize/client';
import { RoleRepository } from './../repositories/sequelize/role';
import { RoleGroupRepository } from './../repositories/sequelize/role-group';

// Imports services
import { ClientService } from './../services/client';
import { RoleService } from './../services/role';

// Imports models
import { Client } from './../entities/client';
import { Role } from './../entities/role';
import { RoleGroup } from './../entities/role-group';

export class ClientsRouter {

    public static async index(req: express.Request, res: express.Response) {

        const clients: Client[] = await ClientsRouter.getClientService().list(req.user.username);

        res.render('clients/index', {
            baseModel: BaseRouter.getBaseModel(),
            clients,
            title: 'Clients',
            user: req.user,
        });
    }

    public static async editGet(req: express.Request, res: express.Response) {
        try {

            if (!req.query.id) {
                res.status(404).render('error/NotFound', { layout: false });
                return;
            }

            const client: Client = await ClientsRouter.getClientService().find(req.user.username, req.query.id);

            if (!client) {
                res.status(404).render('error/NotFound', { layout: false });
                return;
            }

            const roles: Role[] = await ClientsRouter.getRoleService().list(req.user.username, req.query.id);

            res.render('clients/edit', {
                baseModel: BaseRouter.getBaseModel(),
                client,
                roles,
                title: 'Clients - Edit',
                user: req.user,
            });

        } catch (err) {
            res.status(500).render('error/InternalServerError', { layout: false, message: err.message });
        }
    }

    public static async editPost(req: express.Request, res: express.Response) {
        try {

            const client: Client = await ClientsRouter.getClientService().update(req.user.username, req.body.id, req.body.name, req.body.allowForgotPassword ? true : false, req.body.allowRegister ? true : false, req.body.roleName.split('|')[1], req.body.roleName.split('|')[0]);

            if (!client) {
                res.status(500).render('error/InternalServerError', { layout: false });
                return;
            }

            const roles: Role[] = await ClientsRouter.getRoleService().list(req.user.username, req.body.id);

            res.render('clients/edit', {
                baseModel: BaseRouter.getBaseModel(),
                client,
                roles,
                title: 'Clients - Edit',
                user: req.user,
            });
        } catch (err) {
            res.status(500).render('error/InternalServerError', { layout: false, message: err.message });
        }
    }

    public static async addScope(req: express.Request, res: express.Response) {

        const client: Client = await ClientsRouter.getClientService().addScope(req.user.username, req.body.id, req.body.name);

        res.redirect(`/clients/edit?id=${client.id}`);
    }

    public static async removeScope(req: express.Request, res: express.Response) {

        const client: Client = await ClientsRouter.getClientService().removeScope(req.user.username, req.query.id, req.query.name);

        res.redirect(`/clients/edit?id=${client.id}`);
    }

    public static async addRedirectUri(req: express.Request, res: express.Response) {

        const client: Client = await ClientsRouter.getClientService().addRedirectUri(req.user.username, req.body.id, req.body.uri);

        res.redirect(`/clients/edit?id=${client.id}`);
    }

    public static async removeRedirectUri(req: express.Request, res: express.Response) {

        const client: Client = await ClientsRouter.getClientService().removeRedirectUri(req.user.username, req.query.id, req.query.uri);

        res.redirect(`/clients/edit?id=${client.id}`);
    }

    public static async createGet(req: express.Request, res: express.Response) {

        res.render('clients/create', {
            baseModel: BaseRouter.getBaseModel(),
            title: 'Clients - Create',
            user: req.user,
        });
    }

    public static async createPost(req: express.Request, res: express.Response) {

        const client: Client = await ClientsRouter.getClientService().create(req.user.username, req.body.name);

        res.redirect(`/clients/edit?id=${client.id}`);
    }

    protected static getRoleService(): RoleService {

        const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);
        const roleRepository: RoleRepository = new RoleRepository(config.database.host, config.database.username, config.database.password);
        const roleGroupRepository: RoleGroupRepository = new RoleGroupRepository(config.database.host, config.database.username, config.database.password);

        const roleService: RoleService = new RoleService(roleRepository, roleGroupRepository, clientRepository);

        return roleService;
    }

    protected static getClientService(): ClientService {

        const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);

        const clientService: ClientService = new ClientService(clientRepository);

        return clientService;
    }
}
