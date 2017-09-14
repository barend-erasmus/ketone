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
import { User } from './entities/user';

describe('Model', () => {

    let model: Model = null;

    describe('findClient', () => {
        it('should return client', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            const result: boolean = await model.register('client-id', 'user@example.com', 'user', 'password', null);

            expect(result).to.be.true;
        });

        it('should log event', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            await model.register('client-id', 'user@example.com', 'user', 'password', null);

            const events: Event[] = await eventRepository.list('client-id');

            expect(events.length).to.be.eq(1);
        });

        it('should throw error given username exist', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            await model.register('client-id', 'user@example.com', 'user', 'password', null);

            try {
                await model.register('client-id', 'user@example.com', 'user', 'password', null);
                throw new Error('Expected Error');
            } catch (err) {
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
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            const result: boolean = await model.register(config.client.id, 'user@example.com', 'user', 'password', null);

            expect(result).to.be.true;
        });

        it('should log event', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            await model.register(config.client.id, 'user@example.com', 'user', 'password', null);

            const events: Event[] = await eventRepository.list(config.client.id);

            expect(events.length).to.be.eq(1);
        });

        it('should throw error given username exist', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            await model.register(config.client.id, 'user@example.com', 'user', 'password', null);

            try {
                await model.register(config.client.id, 'user@example.com', 'user', 'password', null);
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Username already exist');
            }
        });
    });

    describe('resetPassword', () => {
        it('should return true', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            await model.register('client-id', 'user@example.com', 'user', 'password', null);

            const result: boolean = await model.resetPassword('client-id', 'user', 'password', null);

            expect(result).to.be.true;
        });

        it('should log event', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            await model.register('client-id', 'user@example.com', 'user', 'password', null);

            await model.resetPassword('client-id', 'user', 'password', null);

            const events: Event[] = await eventRepository.list('client-id');

            expect(events.length).to.be.eq(2);
        });

        it('should throw error given username does not exist', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            try {
                await model.resetPassword('client-id', 'user', 'password', null);
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Username does not exist');
            }
        });
    });

    describe('resetPassword as ketone client', () => {
        it('should return true', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            await model.register(config.client.id, 'user@example.com', 'user', 'password', null);

            const result: boolean = await model.resetPassword(config.client.id, 'user', 'password', null);

            expect(result).to.be.true;
        });

        it('should log event', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            await model.register(config.client.id, 'user@example.com', 'user', 'password', null);

            await model.resetPassword(config.client.id, 'user', 'password', null);

            const events: Event[] = await eventRepository.list(config.client.id);

            expect(events.length).to.be.eq(2);
        });

        it('should throw error given username does not exist', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            try {
                await model.resetPassword(config.client.id, 'user', 'password', null);
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Username does not exist');
            }
        });
    });

    describe('sendVerificationEmail', () => {
        it('should return false given invalid email address', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            const result: boolean = await model.sendVerificationEmail('client-id', 'invalid-email-address', 'user', 'http://example.com', null);

            expect(result).to.be.false;
        });

        it('should log event', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            await model.sendVerificationEmail('client-id', 'invalid-email-address', 'user', 'http://example.com', null);

            const events: Event[] = await eventRepository.list('client-id');

            expect(events.length).to.be.eq(1);
        });
    });

    describe('verify', () => {
        it('should return true', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            await model.register('client-id', 'user@example.com', 'user', 'password', null);

            const result: boolean = await model.verify('client-id', 'user', null);

            expect(result).to.be.true;
        });

        it('should update user', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            await model.register('client-id', 'user@example.com', 'user', 'password', null);

            await model.verify('client-id', 'user', null);

            const user: User = await userRepository.find('user', 'client-id');

            expect(user.verified).to.be.true;
        });

        it('should return false given username does not exist', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            const result: boolean = await model.verify('client-id', 'user', null);

            expect(result).to.be.false;
        });
    });

    describe('verify as ketone client', () => {
        it('should return true', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            await model.register(config.client.id, 'user@example.com', 'user', 'password', null);

            const result: boolean = await model.verify(config.client.id, 'user', null);

            expect(result).to.be.true;
        });

        it('should update user', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            await model.register(config.client.id, 'user@example.com', 'user', 'password', null);

            await model.verify(config.client.id, 'user', null);

            const user: User = await ketoneUserRepository.find('user');

            expect(user.verified).to.be.true;
        });

        it('should return false given username does not exist', async () => {
            const clientRepository = new ClientRepository();
            const userRepository: UserRepository = new UserRepository();
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            const eventRepository: EventRepository = new EventRepository();
            model = new Model(clientRepository, ketoneUserRepository, userRepository, eventRepository, 'secret');

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

            const result: boolean = await model.verify(config.client.id, 'user', null);

            expect(result).to.be.false;
        });
    });
});
