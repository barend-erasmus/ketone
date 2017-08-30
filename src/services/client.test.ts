import { expect } from 'chai';
import 'mocha';

import { ClientService } from './client';
import { ClientRepository } from './../repositories/memory/client';

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
});