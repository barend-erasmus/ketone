// Imports
import * as moment from 'moment';

// Imports repositories
import { ClientRepository } from './../repositories/sequelize/client';
import { EventRepository } from './../repositories/sequelize/event';

// Imports models
import { Client } from './../entities/client';
import { Statistic } from './../models/statistic';

export class EventService {

    constructor(private eventRepository: EventRepository, private clientRepository: ClientRepository) {

    }

    public async numberOfLoginsStatistic(username: string): Promise<Statistic> {
        const previousValueTimestamp = moment().subtract(1, 'day').toDate();
        const currentValueTimestamp = moment().toDate();

        const previousValue = await this.countByUsername(username, previousValueTimestamp, 'validateCredentials');
        const currentValue = await this.countByUsername(username, currentValueTimestamp, 'validateCredentials');

        return new Statistic(previousValue, currentValue, previousValueTimestamp, currentValueTimestamp);
    }

    public async numberOfRegistersStatistic(username: string): Promise<Statistic> {
        const previousValueTimestamp = moment().subtract(1, 'day').toDate();
        const currentValueTimestamp = moment().toDate();

        const previousValue = await this.countByUsername(username, previousValueTimestamp, 'register');
        const currentValue = await this.countByUsername(username, currentValueTimestamp, 'register');

        return new Statistic(previousValue, currentValue, previousValueTimestamp, currentValueTimestamp);
    }

    private async countByUsername(username: string, timestamp: Date, name: string): Promise<number> {

        const clients: Client[] = await this.clientRepository.listByUsername(username);

        const numberOfLoginsByClients: number[] = await Promise.all(clients.map((x) => this.eventRepository.count(x.id, name, timestamp)));

        return numberOfLoginsByClients.reduce((a, b) => a + b, 0);
    }
}
