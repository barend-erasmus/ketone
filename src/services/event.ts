// Imports
import * as moment from 'moment';

// Imports repositories
import { IClientRepository } from './../repositories/client';
import { IEventRepository } from './../repositories/event';

// Imports models
import { Client } from './../entities/client';
import { Event } from './../entities/event';
import { Statistic } from './../models/statistic';

export class EventService {

    constructor(private eventRepository: IEventRepository, private clientRepository: IClientRepository) {

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

    public async numberOfResetPasswordsStatistic(username: string): Promise<Statistic> {
        const previousValueTimestamp = moment().subtract(1, 'day').toDate();
        const currentValueTimestamp = moment().toDate();

        const previousValue = await this.countByUsername(username, previousValueTimestamp, 'resetPassword');
        const currentValue = await this.countByUsername(username, currentValueTimestamp, 'resetPassword');

        return new Statistic(previousValue, currentValue, previousValueTimestamp, currentValueTimestamp);
    }

    public async numberOfVerifiesStatistic(username: string): Promise<Statistic> {
        const previousValueTimestamp = moment().subtract(1, 'day').toDate();
        const currentValueTimestamp = moment().toDate();

        const previousValue = await this.countByUsername(username, previousValueTimestamp, 'verify');
        const currentValue = await this.countByUsername(username, currentValueTimestamp, 'verify');

        return new Statistic(previousValue, currentValue, previousValueTimestamp, currentValueTimestamp);
    }

    public async list(username: string): Promise<Event[]> {

        const clients: Client[] = await this.clientRepository.listByUsername(username);

        const clientEvents: Event[][] = await Promise.all(clients.map((x) => this.eventRepository.list(x.id)));

        const events: Event[] = [];

        clientEvents.forEach((x: Event[]) => {
            x.forEach((y) => {
                events.push(y);
            });
        });

        return events.sort((a: Event, b: Event) => {
            return b.timestamp.getTime() - a.timestamp.getTime();
        }).slice(0, 10);
    }

    private async countByUsername(username: string, timestamp: Date, name: string): Promise<number> {

        const clients: Client[] = await this.clientRepository.listByUsername(username);

        const numberOfLoginsByClients: number[] = await Promise.all(clients.map((x) => this.eventRepository.count(x.id, name, timestamp)));

        return numberOfLoginsByClients.reduce((a, b) => a + b, 0);
    }
}
