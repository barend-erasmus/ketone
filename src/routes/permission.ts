// Imports
import * as express from 'express';
import { config } from './../config';
import { BaseRouter } from './base';

// Imports repositories
import { ClientRepository } from './../repositories/sequelize/client';
import { PermissionRepository } from './../repositories/sequelize/permission';

// Imports services
import { ClientService } from './../services/client';
import { PermissionService } from './../services/permission';

// Imports models
import { Client } from './../entities/client';
import { Permission } from './../entities/permission';

export class PermissionsRouter {

    public static async index(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        if (!req.query.clientId) {
            res.status(404).render('error/NotFound', { layout: false });
            return;
        }

        const client: Client = await PermissionsRouter.getClientService().find(req.user, req.query.clientId);

        const permissions: Permission[] = await PermissionsRouter.getRoleService().list(req.user, req.query.clientId);

        res.render('permissions/index', {
            baseModel: BaseRouter.getBaseModel(),
            client,
            permissions,
            title: 'Permissions',
            user: req.user,
        });
    }

    public static async edit(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        if (!req.query.name) {
            res.status(404).render('error/NotFound', { layout: false });
            return;
        }

        if (!req.query.group) {
            res.status(404).render('error/NotFound', { layout: false });
            return;
        }

        if (!req.query.clientId) {
            res.status(404).render('error/NotFound', { layout: false });
            return;
        }

        const client: Client = await PermissionsRouter.getClientService().find(req.user, req.query.clientId);

        const role: Permission = await PermissionsRouter.getRoleService().find(req.user, req.query.name, req.query.clientId);

        res.render('permissions/edit', {
            baseModel: BaseRouter.getBaseModel(),
            client,
            role,
            title: 'Permissions - Edit',
            user: req.user,
        });
    }

    public static async create(req: express.Request, res: express.Response) {

        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        await PermissionsRouter.getRoleService().create(req.user, req.body.name, req.body.clientId);

        res.redirect(`/permissions?clientId=${req.body.clientId}`);
    }

    protected static getRoleService(): PermissionService {

        const permissionRepository: PermissionRepository = new PermissionRepository(config.database.host, config.database.username, config.database.password);
        const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);

        const permissionService: PermissionService = new PermissionService(permissionRepository, clientRepository);

        return permissionService;
    }

    protected static getClientService(): ClientService {

        const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);

        const clientService: ClientService = new ClientService(clientRepository);

        return clientService;
    }
}
