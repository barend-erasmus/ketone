// Imports
import * as express from 'express';

// Imports repositories
import { ClientRepository } from './../repositories/sequelize/client';
import { EventRepository } from './../repositories/sequelize/event';

// Imports services
import { EventService } from './../services/event';

// Imports models
import { Statistic } from './../models/statistic';

export class HomeRouter {

    public static async index(req: express.Request, res: express.Response) {
        if (!req.user) {
            res.redirect('/auth/login');
            return;
        }

        const numberOfLoginsStatistic: Statistic = await HomeRouter.getEventService().numberOfLoginsStatistic(req.user);
        const numberOfRegistersStatistic: Statistic = await HomeRouter.getEventService().numberOfRegistersStatistic(req.user);
        const numberOfResetPasswordsStatistic: Statistic = await HomeRouter.getEventService().numberOfResetPasswordsStatistic(req.user);
        const numberOfVerifiesStatistic: Statistic = await HomeRouter.getEventService().numberOfVerifiesStatistic(req.user);

        res.render('home/index', {
            numberOfLoginsStatistic,
            numberOfRegistersStatistic,
            numberOfResetPasswordsStatistic,
            numberOfVerifiesStatistic,
            title: 'Home',
            user: req.user,
        });
    }

    protected static getEventService(): EventService {
        const host = 'developersworkspace.co.za';
        const username = 'ketone';
        const password = 'ZiLSLzrIVhCrcdN6';

        const clientRepository: ClientRepository = new ClientRepository(host, username, password);
        const eventRepository: EventRepository = new EventRepository(host, username, password);

        const eventService: EventService = new EventService(eventRepository, clientRepository);

        return eventService;
    }
}
