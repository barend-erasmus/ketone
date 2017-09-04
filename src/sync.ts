// Import Repositories
import { config } from './config';
import { BaseRepository } from './repositories/sequelize/base';
import { ClientRepository } from './repositories/sequelize/client';
import { KetoneUserRepository } from './repositories/sequelize/ketone-user';
import { RoleRepository } from './repositories/sequelize/role';
import { RoleGroupRepository } from './repositories/sequelize/role-group';
import { UserRepository } from './repositories/sequelize/user';

// Imports services

// Imports models
import { Client } from './entities/client';
import { KetoneUser } from './entities/ketone-user';
import { Role } from './entities/role';
import { RoleGroup } from './entities/role-group';
import { User } from './entities/user';

const baseRepository: BaseRepository = new BaseRepository(config.database.host, config.database.username, config.database.password);
const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);
const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository(config.database.host, config.database.username, config.database.password);
const roleRepository: RoleRepository = new RoleRepository(config.database.host, config.database.username, config.database.password);
const roleGroupRepository: RoleGroupRepository = new RoleGroupRepository(config.database.host, config.database.username, config.database.password);
const userRepository: UserRepository = new UserRepository(config.database.host, config.database.username, config.database.password);

baseRepository.sync().then(async () => {

    await ketoneUserRepository.create(new KetoneUser(
        'developersworkspace@gmail.com',
        'developersworkspace@gmail.com',
        '6df0e8bca3a739f89b866f42d218a081', // 123456
        true,
        true,
        null,
        'XYZ',
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

    await ketoneUserRepository.create(new KetoneUser(
        'demo',
        'developersworkspace@gmail.com',
        '6df0e8bca3a739f89b866f42d218a081', // 123456
        true,
        true,
        null,
        'ABC',
    ));

    await clientRepository.create(new Client(
        'Test Client',
        '7Ewz5a32gnkQz9iCvyk5',
        '0LVofOQvDsY2TESLZ60G',
        [],
        [],
        true,
        true,
        'demo',
    ));

    await roleGroupRepository.create(new RoleGroup('Common'), '7Ewz5a32gnkQz9iCvyk5');

    await roleRepository.create(new Role('Basic User', new RoleGroup('Common'), []), '7Ewz5a32gnkQz9iCvyk5');

    await userRepository.create(new User('TestUser', 'testuser@example.com', '6df0e8bca3a739f89b866f42d218a081', false, true, null, new Role('Basic User', new RoleGroup('Common'), [])), '7Ewz5a32gnkQz9iCvyk5');

    const user: User = await userRepository.find('TestUser', '7Ewz5a32gnkQz9iCvyk5');
    console.log(user);

    baseRepository.close();
}).catch((err: Error) => {
    console.error(err);
    baseRepository.close();
});
