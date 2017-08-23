// Import Repositories
import { config } from './config';
import { BaseRepository } from './repositories/sequelize/base';
import { ClientRepository } from './repositories/sequelize/client';
import { KetoneUserRepository } from './repositories/sequelize/ketone-user';

// Imports services

// Imports models
import { Client } from './entities/client';
import { User } from './entities/user';

const baseRepository: BaseRepository = new BaseRepository(config.database.host, config.database.username, config.database.password);
const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);
const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository(config.database.host, config.database.username, config.database.password);

baseRepository.sync().then(async () => {

    await ketoneUserRepository.create(new User(
        'developersworkspace@gmail.com',
        'developersworkspace@gmail.com',
        '123456',
        true,
        true,
        null,
    ));

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

    await ketoneUserRepository.create(new User(
        'demo',
        'developersworkspace@gmail.com',
        '123456',
        true,
        true,
        null,
    ));

    baseRepository.close();
}).catch((err: Error) => {
    console.error(err);
});
