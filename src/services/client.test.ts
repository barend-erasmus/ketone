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

        it('should throw error given null client name', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            try {
                await clientService.create('username', null);
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Invalid Client Name');
            }
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

            client = await clientService.update('username', client.id, 'client-name', true, true, null, null);

            expect(client).to.be.not.null;
        });

        it('should update the client', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            let client: Client = await clientService.create('username', 'client-name');

            client = await clientService.update('username', client.id, 'client-name-updated', true, true, 'role', 'role-group');

            expect(client.name).to.be.eq('client-name-updated');
            expect(client.allowForgotPassword).to.be.true;
            expect(client.allowRegister).to.be.true;
            expect(client.role).to.be.not.null;
        });

        it('should throw error given role and null role group', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            const client: Client = await clientService.create('username', 'client-name');

            try {
                await clientService.update('username', client.id, 'client-name', true, true, 'role', null);
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Invalid Role');
            }
        });

        it('should throw error given client id does not exist', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            try {
                await clientService.update('username', 'client-id', 'client-name', true, true, null, null);
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
                await clientService.update('other-username', client.id, 'client-name', true, true, null, null);
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

        it('should throw error given scope already exists', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            const client: Client = await clientService.create('username', 'client-name');

            await clientService.addScope('username', client.id, 'scope');

            try {
                await clientService.addScope('username', client.id, 'scope');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Scope already exist');
            }
        });

        it('should throw error given null scope', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            const client: Client = await clientService.create('username', 'client-name');

            try {
                await clientService.addScope('username', client.id, null);
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Invalid Scope Name');
            }
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

    describe('removeScope', () => {
        it('should return client', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            let client: Client = await clientService.create('username', 'client-name');

            client = await clientService.addScope('username', client.id, 'scope');

            client = await clientService.removeScope('username', client.id, 'scope');

            expect(client).to.be.not.null;
        });

        it('should remove a scope', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            let client: Client = await clientService.create('username', 'client-name');

            client = await clientService.addScope('username', client.id, 'scope');

            client = await clientService.removeScope('username', client.id, 'scope');

            expect(client.allowedScopes.length).to.be.eq(0);
        });

        it('should throw error given scope does not exist', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            const client: Client = await clientService.create('username', 'client-name');

            try {
                await clientService.removeScope('username', client.id, 'scope');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Scope does not exist');
            }
        });

        it('should throw error given client id does not exist', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            try {
                await clientService.removeScope('username', 'client-id', 'scope');
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
                await clientService.removeScope('other-username', client.id, 'scope');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('You are not the owner of this Client Id');
            }
        });
    });

    describe('addRedirectUri', () => {
        it('should return client', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            let client: Client = await clientService.create('username', 'client-name');

            client = await clientService.addRedirectUri('username', client.id, 'redirect-uri');

            expect(client).to.be.not.null;
        });

        it('should add a redirect uri', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            let client: Client = await clientService.create('username', 'client-name');

            client = await clientService.addRedirectUri('username', client.id, 'redirect-uri');

            expect(client.redirectUris.length).to.be.eq(1);
        });

        it('should throw error given client id does not exist', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            try {
                await clientService.addRedirectUri('username', 'client-id', 'redirect-uri');
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
                await clientService.addRedirectUri('other-username', client.id, 'redirect-uri');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('You are not the owner of this Client Id');
            }
        });
    });

    describe('removeRedirectUri', () => {
        it('should return client', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            let client: Client = await clientService.create('username', 'client-name');

            client = await clientService.addScope('username', client.id, 'scope');

            client = await clientService.removeRedirectUri('username', client.id, 'redirect-uri');

            expect(client).to.be.not.null;
        });

        it('should remove a redirect uri', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            let client: Client = await clientService.create('username', 'client-name');

            client = await clientService.addRedirectUri('username', client.id, 'redirect-uri');

            client = await clientService.removeRedirectUri('username', client.id, 'redirect-uri');

            expect(client.allowedScopes.length).to.be.eq(0);
        });

        it('should throw error given client id does not exist', async () => {
            const clientRepository: ClientRepository = new ClientRepository();
            clientService = new ClientService(clientRepository);

            try {
                await clientService.removeRedirectUri('username', 'client-id', 'redirect-uri');
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
                await clientService.removeRedirectUri('other-username', client.id, 'redirect-uri');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('You are not the owner of this Client Id');
            }
        });
    });
});
