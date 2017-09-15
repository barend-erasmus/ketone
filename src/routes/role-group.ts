// Imports
import * as express from 'express';
import { config } from './../config';

// Imports repositories
import { ClientRepository } from './../repositories/sequelize/client';
import { RoleRepository } from './../repositories/sequelize/role';
import { RoleGroupRepository } from './../repositories/sequelize/role-group';

// Imports services
import { RoleService } from './../services/role';

// Imports models
import { RoleGroup } from './../entities/role-group';

export class RoleGroupRouter {

    public static async create(req: express.Request, res: express.Response) {

        await RoleGroupRouter.getRoleService().createGroup(req.user.username, req.body.name, req.body.clientId);

        res.redirect(`/roles?clientId=${req.body.clientId}`);
    }

    protected static getRoleService(): RoleService {

        const roleRepository: RoleRepository = new RoleRepository(config.database.host, config.database.username, config.database.password);
        const roleGroupRepository: RoleGroupRepository = new RoleGroupRepository(config.database.host, config.database.username, config.database.password);
        const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);

        const roleService: RoleService = new RoleService(roleRepository, roleGroupRepository, clientRepository);

        return roleService;
    }
}
