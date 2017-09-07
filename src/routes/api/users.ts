// Imports
import * as express from 'express';
import { config } from './../../config';

// Imports repositories
import { ClientRepository } from './../../repositories/sequelize/client';
import { KetoneUserRepository } from './../../repositories/sequelize/ketone-user';
import { UserRepository } from './../../repositories/sequelize/user';

// Imports services
import { KetoneUserService } from './../../services/ketone-user';
import { UserService } from './../../services/user';

// Imports models
import { KetoneUser } from './../../entities/ketone-user';
import { User } from './../../entities/user';

export class APIUsersRouter {

    /**
     * @api {get} /api/users Get Users
     * @apiName GetUsers
     * @apiGroup Users
     *
     * @apiParam {string} clientId Client Id
     *
     *
     * @apiHeaderExample {json} Header-Example:
     *      {
     *          "Authorization": "<api-key>"
     *      }
     *
     * @apiSuccessExample {json} Success-Response:
     *      HTTP/1.1 200 OK
     *      [
     *          {
     *              "username": "TestUser",
     *              "emailAddress": "testuser@example.com",
     *              "password": "6df0e8bca3a739f89b866f42d218a081",
     *              "verified": false,
     *              "enabled": true,
     *              "profileImage": null,
     *              "role": {
     *                  "name": "Standard User",
     *                  "group": {
     *                      "name": "Common"
     *                  },
     *                  "permissions": [
     *                      {
     *                          "name": "View"
     *                      },
     *                      {
     *                          "name": "Create"
     *                      },
     *                      {
     *                          "name": "Update"
     *                      }
     *                  ]
     *              }
     *          }
     *      ]
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
                message: err.message,
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
