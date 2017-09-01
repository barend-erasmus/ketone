import { expect } from 'chai';
import 'mocha';

import { ClientRepository } from './../repositories/memory/client';
import { ClientService } from './client';

import { Client } from './../entities/client';

describe('ClientService', () => {

    let clientService: ClientService = null;

    describe('create', () => {
        it('should return client', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            const client: Client = await clientService.create('username', 'client-name');

            expect(client).to.be.not.null;
        });
    });

    describe('find', () => {
        it('should return client', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            let client: Client = await clientService.create('username', 'client-name');

            client = await clientService.find('username', client.id);

            expect(client).to.be.not.null;
        });

        it('should throw error given client id does not exist', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            try {
                await clientService.find('username', 'client-id');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Invalid Client Id');
            }
        });

        it('should throw error given user does not own client', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            const client: Client = await clientService.create('username', 'client-name');

            try {
                await clientService.find('other-username', client.id);
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('You are not the owner of this Client Id');
            }
        });
    });

    describe('update', () => {
        it('should return true', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            let client: Client = await clientService.create('username', 'client-name');

            client = await clientService.update('username', client.id, 'client-name', true, true);

            expect(client).to.be.not.null;
        });

        it('should update the client', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            let client: Client = await clientService.create('username', 'client-name');

            client = await clientService.update('username', client.id, 'client-name-updated', true, true);

            expect(client.name).to.be.eq('client-name-updated');
            expect(client.allowForgotPassword).to.be.true;
            expect(client.allowRegister).to.be.true;
        });

        it('should throw error given client id does not exist', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            try {
                await clientService.update('username', 'client-id', 'client-name', true, true);
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Invalid Client Id');
            }
        });

        it('should throw error given user does not own client', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            const client: Client = await clientService.create('username', 'client-name');

            try {
                await clientService.update('other-username', client.id, 'client-name', true, true);
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('You are not the owner of this Client Id');
            }
        });
    });

    describe('list', () => {
        it('should return list of clients', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            await clientService.create('username', 'client-name');

            const clients: Client[] = await clientService.list('username');

            expect(clients.length).to.be.eq(1);
        });

        it('should return empty list of clients given username has no clients', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            const clients: Client[] = await clientService.list('username');

            expect(clients.length).to.be.eq(0);
        });
    });

    describe('addScope', () => {
        it('should return client', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            let client: Client = await clientService.create('username', 'client-name');

            client = await clientService.addScope('username', client.id, 'scope');

            expect(client).to.be.not.null;
        });

        it('should add a scope', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            let client: Client = await clientService.create('username', 'client-name');

            client = await clientService.addScope('username', client.id, 'scope');

            expect(client.allowedScopes.length).to.be.eq(1);
        });

        it('should throw error given client id does not exist', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            try {
                await clientService.addScope('username', 'client-id', 'scope');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Invalid Client Id');
            }
        });

        it('should throw error given user does not own client', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            const client: Client = await clientService.create('username', 'client-name');

            try {
                await clientService.addScope('other-username', client.id, 'scope');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('You are not the owner of this Client Id');
            }
        });
    });
});
