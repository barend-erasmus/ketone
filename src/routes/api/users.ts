// Imports
import * as express from 'express';
import { config } from './../../config';

// Imports repositories
import { ClientRepository } from './../../repositories/sequelize/client';
import { UserRepository } from './../../repositories/sequelize/user';
import { KetoneUserRepository } from './../../repositories/sequelize/ketone-user';

// Imports services
import { UserService } from './../../services/user';
import { KetoneUserService } from './../../services/ketone-user';

// Imports models
import { User } from './../../entities/user';
import { KetoneUser } from './../../entities/ketone-user';

export class APIUsersRouter {

    /**
     * @api {get} /api/users Get Users
     * @apiName GetUsers
     * @apiGroup Users
     *
     * @apiParam {string} clientId Client Id
     * 
     * 
     @apiHeaderExample {json} Header-Example:
     *      {
     *          "Authorization": "<api-key>"
     *      }
     * 
     * @apiSuccessExample {json} Success-Response:
     *      HTTP/1.1 200 OK
     *      [
     *           {
     *               "username": "user-1",
     *               "emailAddress": "user-1@example.com",
     *               "password": "123456",
     *               "verified": false,
     *               "enabled": true,
     *               "profileImage": null
     *           }
     *       ]
     */
    public static async get(req: express.Request, res: express.Response) {

        try {
            const user: KetoneUser = await APIUsersRouter.getKetoneUserService().findByAPIKey(req.get('authorization'));
            if (!user) {
                res.status(401).end();
                return;
            }

            if (!req.query.clientId) {
                res.status(400).end();
                return;
            }

            const users: User[] = await APIUsersRouter.getUserService().list(user.username, req.query.clientId);

            res.json(users);
        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    }

    protected static getUserService(): UserService {
        const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);
        const userRepository: UserRepository = new UserRepository(config.database.host, config.database.username, config.database.password);
        const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository(config.database.host, config.database.username, config.database.password);

        const userService: UserService = new UserService(userRepository, ketoneUserRepository, clientRepository);

        return userService;
    }

    protected static getKetoneUserService(): KetoneUserService {
        const userRepository: KetoneUserRepository = new KetoneUserRepository(config.database.host, config.database.username, config.database.password);

        const userService: KetoneUserService = new KetoneUserService(userRepository);

        return userService;
    }
}
