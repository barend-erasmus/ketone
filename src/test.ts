// Import Repositories
import { BaseRepository } from './repositories/sequelize/base';
import { ClientRepository } from './repositories/sequelize/client';
import { KetoneUserRepository } from './repositories/sequelize/ketone-user';

// Imports services

// Imports models
import { Client } from './entities/client';
import { User } from './entities/user';

const host = 'developersworkspace.co.za';
const username = 'ketone';
const password = 'ZiLSLzrIVhCrcdN6';

const baseRepository: BaseRepository = new BaseRepository(host, username, password);
const clientRepository: ClientRepository = new ClientRepository(host, username, password);
const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository(host, username, password);

baseRepository.sync().then(async () => {

    await ketoneUserRepository.create(new User(
        'admin',
        'developersworkspace@gmail.com',
        '123456',
        true,
        true,
        null,
    ));

    await clientRepository.create(new Client(
        'Ketone',
        'fLTSn80KPQNOPCS2R7dq',
        '8XjrVJiYMqPaDiJfH21X',
        [
            'read',
            'read-write',
            'admin',
        ],
        [
            'http://localhost:3000/auth/callback',
            'https://ketone.openservices.co.za/auth/callback',
        ],
        true,
        true,
        'admin',
    ));

    await clientRepository.create(new Client(
        'Demo App',
        'xu5xGBrEzAd59PaUiV0Z',
        'a9Hsankx6E9v4DQDPFCt',
        [
            'read',
            'read-write',
            'admin',
        ],
        [
            'http://localhost:3000/auth/callback',
            'https://ketone.openservices.co.za/auth/callback',
        ],
        true,
        true,
        'admin',
    ));

    baseRepository.close();
});
