import { expect } from 'chai';
import 'mocha';
import { config } from './config';

import { Client as OAuth2FrameworkClient } from 'oauth2-framework';

import { Model } from './model';

import { ClientRepository } from './repositories/memory/client';
import { EventRepository } from './repositories/memory/event';
import { KetoneUserRepository } from './repositories/memory/ketone-user';
import { UserRepository } from './repositories/memory/user';

import { Client } from './entities/client';
import { Event } from './entities/event';

describe('Model', () => {

    let model: Model = null;

    describe('findClient', () => {
        it('should return client', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository);

            await clientRepository.create(new Client(
                'client-name',
                'client-id',
                'client-secret',
                [],
                [],
                true,
                true,
                'developersworkspace@gmail.com',
                null,
            ));

            const client: OAuth2FrameworkClient = await model.findClient('client-id', null);

            expect(client).to.be.not.null;
        });
    });

    describe('register', () => {
        it('should return true', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository);

            await clientRepository.create(new Client(
                'client-name',
                'client-id',
                'client-secret',
                [],
                [],
                true,
                true,
                'developersworkspace@gmail.com',
                null,
            ));

            const result: boolean = await model.register('client-id', 'user@example.com', 'user', '123456', null);

            expect(result).to.be.true;
        });

        it('should log event', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository);

            await clientRepository.create(new Client(
                'client-name',
                'client-id',
                'client-secret',
                [],
                [],
                true,
                true,
                'developersworkspace@gmail.com',
                null,
            ));

            await model.register('client-id', 'user@example.com', 'user', '123456', null);

            const events: Event[] = await eventRepository.list('client-id');

            expect(events.length).to.be.eq(1);
        });

        it('should throw error given username exist', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository);

            await clientRepository.create(new Client(
                'client-name',
                'client-id',
                'client-secret',
                [],
                [],
                true,
                true,
                'developersworkspace@gmail.com',
                null,
            ));

            await model.register('client-id', 'user@example.com', 'user', '123456', null);

            try {
                await model.register('client-id', 'user@example.com', 'user', '123456', null);
                throw new Error('Expected Error');
            }catch (err) {
                expect(err.message).to.be.eq('Username already exist');
            }
        });
    });

    describe('register as ketone client', () => {
        it('should return true', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository);

            await clientRepository.create(new Client(
                config.client.name,
                config.client.id,
                config.client.secret,
                [],
                [],
                true,
                true,
                'developersworkspace@gmail.com',
                null,
            ));

            const result: boolean = await model.register(config.client.id, 'user@example.com', 'user', '123456', null);

            expect(result).to.be.true;
        });

        it('should log event', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository);

            await clientRepository.create(new Client(
                config.client.name,
                config.client.id,
                config.client.secret,
                [],
                [],
                true,
                true,
                'developersworkspace@gmail.com',
                null,
            ));

            await model.register(config.client.id, 'user@example.com', 'user', '123456', null);

            const events: Event[] = await eventRepository.list(config.client.id);

            expect(events.length).to.be.eq(1);
        });

        it('should throw error given username exist', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository);

            await clientRepository.create(new Client(
                config.client.name,
                config.client.id,
                config.client.secret,
                [],
                [],
                true,
                true,
                'developersworkspace@gmail.com',
                null,
            ));

            await model.register(config.client.id, 'user@example.com', 'user', '123456', null);

            try {
                await model.register(config.client.id, 'user@example.com', 'user', '123456', null);
                throw new Error('Expected Error');
            }catch (err) {
                expect(err.message).to.be.eq('Username already exist');
            }
        });
    });
});
