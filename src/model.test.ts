import { expect } from 'chai';
import 'mocha';
import { config } from './config';

import { Client as OAuth2FrameworkClient } from 'oauth2-framework';

import { Model } from './model';

import { ClientRepository } from './repositories/memory/client';

import { Client } from './entities/client';

describe('Model', () => {

    let model: Model = null;

    describe('create', () => {
        it('should return client', async () => {
            const clientRepository = new ClientRepository();
            model = new Model(clientRepository);

            await clientRepository.create(new Client(
                config.client.name,
                config.client.id,
                config.client.secret,
                [
                    'read',
                    'read-write',
                    'admin',
                ],
                [
                    'http://localhost:3000/auth/callback',
                    `${config.domain}/auth/callback`,
                ],
                true,
                true,
                'developersworkspace@gmail.com',
            ));

            const client: OAuth2FrameworkClient = await model.findClient(config.client.id, null);

            expect(client).to.be.not.null;
        });
    });
});