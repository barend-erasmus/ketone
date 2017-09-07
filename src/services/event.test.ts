import { expect } from 'chai';
import 'mocha';
import * as moment from 'moment';

import { ClientRepository } from './../repositories/memory/client';
import { EventRepository } from './../repositories/memory/event';
import { EventService } from './event';

import { Client } from './../entities/client';
import { Event } from './../entities/event';
import { Statistic } from './../models/statistic';

describe('EventService', () => {

    let eventService: EventService = null;

    describe('list', () => {
        it('should return list of events', async () => {
            const eventRepository: EventRepository = new EventRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            eventService = new EventService(eventRepository, clientRepository);

            await clientRepository.create(new Client('client', 'client-id', 'client-secret', [], [], true, true, 'username', null));

            await eventRepository.create(new Event('client-id', 'username', 'event', '127.0.0.1', moment().toDate()));

            const events: Event[] = await eventService.list('username');

            expect(events.length).to.be.eq(1);
        });

        it('should return list of events in descending order', async () => {
            const eventRepository: EventRepository = new EventRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            eventService = new EventService(eventRepository, clientRepository);

            await clientRepository.create(new Client('client', 'client-id', 'client-secret', [], [], true, true, 'username', null));

            const dates: Date[] = [
                moment().subtract('6', 'hours').toDate(),
                moment().toDate(),
            ];

            await eventRepository.create(new Event('client-id', 'username', 'event', '127.0.0.1', dates[0]));

            await eventRepository.create(new Event('client-id', 'username', 'event', '127.0.0.1', dates[1]));

            const events: Event[] = await eventService.list('username');

            expect(events[0].timestamp).to.be.eq(dates[1]);
            expect(events[1].timestamp).to.be.eq(dates[0]);
        });
    });

    describe('numberOfLoginsStatistic', () => {
        it('should return statistic', async () => {
            const eventRepository: EventRepository = new EventRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            eventService = new EventService(eventRepository, clientRepository);

            await clientRepository.create(new Client('client', 'client-id', 'client-secret', [], [], true, true, 'username', null));

            await eventRepository.create(new Event('client-id', 'username', 'validateCredentials', '127.0.0.1', moment().toDate()));

            const result: Statistic = await eventService.numberOfLoginsStatistic('username');

            expect(result.growth).to.be.eq(1);
        });
    });

    describe('numberOfRegistersStatistic', () => {
        it('should return statistic', async () => {
            const eventRepository: EventRepository = new EventRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            eventService = new EventService(eventRepository, clientRepository);

            await clientRepository.create(new Client('client', 'client-id', 'client-secret', [], [], true, true, 'username', null));

            await eventRepository.create(new Event('client-id', 'username', 'register', '127.0.0.1', moment().toDate()));

            const result: Statistic = await eventService.numberOfRegistersStatistic('username');

            expect(result.growth).to.be.eq(1);
        });
    });

    describe('numberOfResetPasswordsStatistic', () => {
        it('should return statistic', async () => {
            const eventRepository: EventRepository = new EventRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            eventService = new EventService(eventRepository, clientRepository);

            await clientRepository.create(new Client('client', 'client-id', 'client-secret', [], [], true, true, 'username', null));

            await eventRepository.create(new Event('client-id', 'username', 'resetPassword', '127.0.0.1', moment().toDate()));

            const result: Statistic = await eventService.numberOfResetPasswordsStatistic('username');

            expect(result.growth).to.be.eq(1);
        });
    });

    describe('numberOfVerifiesStatistic', () => {
        it('should return statistic', async () => {
            const eventRepository: EventRepository = new EventRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            eventService = new EventService(eventRepository, clientRepository);

            await clientRepository.create(new Client('client', 'client-id', 'client-secret', [], [], true, true, 'username', null));

            await eventRepository.create(new Event('client-id', 'username', 'verify', '127.0.0.1', moment().toDate()));

            const result: Statistic = await eventService.numberOfVerifiesStatistic('username');

            expect(result.growth).to.be.eq(1);
        });
    });
});
