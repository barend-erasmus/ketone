// Imports
import * as express from 'express';
import { config } from './../config';
import { BaseRouter } from './base';

// Imports repositories
import { ClientRepository } from './../repositories/sequelize/client';
import { PermissionRepository } from './../repositories/sequelize/permission';
import { RoleRepository } from './../repositories/sequelize/role';
import { RoleGroupRepository } from './../repositories/sequelize/role-group';

// Imports services
import { ClientService } from './../services/client';
import { PermissionService } from './../services/permission';
import { RoleService } from './../services/role';

// Imports models
import { Client } from './../entities/client';
import { Permission } from './../entities/permission';
import { Role } from './../entities/role';
import { RoleGroup } from './../entities/role-group';

export class RolesRouter {

    public static async index(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect(config.paths.unauthorized);
            return;
        }

        if (!req.query.clientId) {
            res.status(404).render('error/NotFound', { layout: false });
            return;
        }

        const client: Client = await RolesRouter.getClientService().find(req.user, req.query.clientId);

        const roles: Role[] = await RolesRouter.getRoleService().list(req.user, req.query.clientId);

        const roleGroups: RoleGroup[] = await RolesRouter.getRoleService().listGroups(req.user, req.query.clientId);

        res.render('roles/index', {
            baseModel: BaseRouter.getBaseModel(),
            client,
            roleGroups,
            roles,
            title: 'Roles',
            user: req.user,
        });
    }

    public static async edit(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect(config.paths.unauthorized);
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

        const client: Client = await RolesRouter.getClientService().find(req.user, req.query.clientId);

        const role: Role = await RolesRouter.getRoleService().find(req.user, req.query.name, req.query.group, req.query.clientId);

        const permissions: Permission[] = await RolesRouter.getPermissionService().list(req.user, req.query.clientId);

        res.render('roles/edit', {
            baseModel: BaseRouter.getBaseModel(),
            client,
            permissions,
            role,
            title: 'Roles - Edit',
            user: req.user,
        });
    }

    public static async create(req: express.Request, res: express.Response) {

        if (!req.user) {
            res.redirect(config.paths.unauthorized);
            return;
        }

        await RolesRouter.getRoleService().create(req.user, req.body.name, req.body.group, req.body.clientId);

        res.redirect(`/roles?clientId=${req.body.clientId}`);
    }

    protected static getRoleService(): RoleService {

        const roleRepository: RoleRepository = new RoleRepository(config.database.host, config.database.username, config.database.password);
        const roleGroupRepository: RoleGroupRepository = new RoleGroupRepository(config.database.host, config.database.username, config.database.password);
        const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);

        const roleService: RoleService = new RoleService(roleRepository, roleGroupRepository, clientRepository);

        return roleService;
    }

    protected static getPermissionService(): PermissionService {

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
