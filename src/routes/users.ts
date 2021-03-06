// Imports
import * as express from 'express';
import { config } from './../config';
import { BaseRouter } from './base';

// Imports repositories
import { ClientRepository } from './../repositories/sequelize/client';
import { KetoneUserRepository } from './../repositories/sequelize/ketone-user';
import { RoleRepository } from './../repositories/sequelize/role';
import { RoleGroupRepository } from './../repositories/sequelize/role-group';
import { UserRepository } from './../repositories/sequelize/user';

// Imports services
import { ClientService } from './../services/client';
import { RoleService } from './../services/role';
import { UserService } from './../services/user';

// Imports models
import { Client } from './../entities/client';
import { Role } from './../entities/role';
import { User } from './../entities/user';

export class UsersRouter {

    public static async index(req: express.Request, res: express.Response) {

        if (!req.query.clientId) {
            res.status(404).render('error/NotFound', { layout: false });
            return;
        }

        const client: Client = await UsersRouter.getClientService().find(req.user.username, req.query.clientId);

        const users: User[] = await UsersRouter.getUserService().list(req.user.username, req.query.clientId);

        res.render('users/index', {
            baseModel: BaseRouter.getBaseModel(),
            client,
            title: 'Users',
            user: req.user,
            users,
        });
    }

    public static async editGet(req: express.Request, res: express.Response) {

        if (!req.query.username) {
            res.status(404).render('error/NotFound', { layout: false });
            return;
        }

        if (!req.query.clientId) {
            res.status(404).render('error/NotFound', { layout: false });
            return;
        }

        const client: Client = await UsersRouter.getClientService().find(req.user.username, req.query.clientId);

        const editUser: User = await UsersRouter.getUserService().find(req.user.username, req.query.username, req.query.clientId);

        const roles: Role[] = await UsersRouter.getRoleService().list(req.user.username, req.query.clientId);

        res.render('users/edit', {
            baseModel: BaseRouter.getBaseModel(),
            client,
            editUser,
            roles,
            title: 'Users - Edit',
            user: req.user,
        });
    }

    public static async editPost(req: express.Request, res: express.Response) {

        const client: Client = await UsersRouter.getClientService().find(req.user.username, req.body.clientId);

        const editUser: User = await UsersRouter.getUserService().update(req.user.username, req.body.username, req.body.clientId, req.body.enabled ? true : false, req.body.roleName? req.body.roleName.split('|')[1] : null, req.body.roleName? req.body.roleName.split('|')[0] : null);

        const roles: Role[] = await UsersRouter.getRoleService().list(req.user.username, req.query.clientId);

        res.render('users/edit', {
            baseModel: BaseRouter.getBaseModel(),
            client,
            editUser,
            roles,
            title: 'Users - Edit',
            user: req.user,
        });
    }

    public static async createGet(req: express.Request, res: express.Response) {

        if (!req.query.clientId) {
            res.status(404).render('error/NotFound', { layout: false });
            return;
        }

        const client: Client = await UsersRouter.getClientService().find(req.user.username, req.query.clientId);

        res.render('users/create', {
            baseModel: BaseRouter.getBaseModel(),
            client,
            title: 'Users - Create',
            user: req.user,
        });
    }

    public static async createPost(req: express.Request, res: express.Response) {

        const user: User = await UsersRouter.getUserService().create(req.user.username, req.body.clientId, req.body.username, req.body.emailAddress, req.body.password, req.body.enabled);

        if (!user) {
            res.status(500).render('error/InternalServerError', { layout: false });
            return;
        }

        res.redirect(`/users/edit?clientId=${req.body.clientId}&username=${user.username}`);
    }

    protected static getUserService(): UserService {

        const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);
        const userRepository: UserRepository = new UserRepository(config.database.host, config.database.username, config.database.password);
        const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository(config.database.host, config.database.username, config.database.password);

        const userService: UserService = new UserService(userRepository, ketoneUserRepository, clientRepository);

        return userService;
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
