// Import Repositories
import { config } from './config';
import { BaseRepository } from './repositories/sequelize/base';
import { ClientRepository } from './repositories/sequelize/client';
import { KetoneUserRepository } from './repositories/sequelize/ketone-user';
import { PermissionRepository } from './repositories/sequelize/permission';
import { RoleRepository } from './repositories/sequelize/role';
import { RoleGroupRepository } from './repositories/sequelize/role-group';
import { UserRepository } from './repositories/sequelize/user';

// Imports services

// Imports models
import { Client } from './entities/client';
import { KetoneUser } from './entities/ketone-user';
import { Permission } from './entities/permission';
import { Role } from './entities/role';
import { RoleGroup } from './entities/role-group';
import { User } from './entities/user';

const baseRepository: BaseRepository = new BaseRepository(config.database.host, config.database.username, config.database.password);
const clientRepository: ClientRepository = new ClientRepository(config.database.host, config.database.username, config.database.password);
const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository(config.database.host, config.database.username, config.database.password);
const roleRepository: RoleRepository = new RoleRepository(config.database.host, config.database.username, config.database.password);
const roleGroupRepository: RoleGroupRepository = new RoleGroupRepository(config.database.host, config.database.username, config.database.password);
const userRepository: UserRepository = new UserRepository(config.database.host, config.database.username, config.database.password);
const permissionRepository: PermissionRepository = new PermissionRepository(config.database.host, config.database.username, config.database.password);

baseRepository.sync().then(async () => {

    // Start
    await ketoneUserRepository.create(new KetoneUser(
        'developersworkspace@gmail.com',
        'developersworkspace@gmail.com',
        '6df0e8bca3a739f89b866f42d218a081', // 123456
        true,
        true,
        null,
        'tJuBB5WJNDjRYbQDxBTG',
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
        null,
    ));

    await roleGroupRepository.create(new RoleGroup('Admin'), config.client.id);
    
    await permissionRepository.create(new Permission('View Client'), config.client.id);
    await permissionRepository.create(new Permission('Create Client'), config.client.id);
    await permissionRepository.create(new Permission('Update Client'), config.client.id);

    await permissionRepository.create(new Permission('View Client User'), config.client.id);
    await permissionRepository.create(new Permission('Create Client User'), config.client.id);
    await permissionRepository.create(new Permission('Update Client User'), config.client.id);

    await permissionRepository.create(new Permission('View Client User'), config.client.id);
    await permissionRepository.create(new Permission('Create Client User'), config.client.id);
    await permissionRepository.create(new Permission('Update Client User'), config.client.id);

    await permissionRepository.create(new Permission('View Client Scope'), config.client.id);
    await permissionRepository.create(new Permission('Create Client Scope'), config.client.id);
    await permissionRepository.create(new Permission('Update Client Scope'), config.client.id);

    await permissionRepository.create(new Permission('View Client Redirect Uri'), config.client.id);
    await permissionRepository.create(new Permission('Create Client Redirect Uri'), config.client.id);
    await permissionRepository.create(new Permission('Update Client Redirect Uri'), config.client.id);

    await permissionRepository.create(new Permission('View Client Role Group'), config.client.id);
    await permissionRepository.create(new Permission('Create Client Role Group'), config.client.id);
    await permissionRepository.create(new Permission('Update Client Role Group'), config.client.id);

    await permissionRepository.create(new Permission('View Client Role'), config.client.id);
    await permissionRepository.create(new Permission('Create Client Role'), config.client.id);
    await permissionRepository.create(new Permission('Update Client Role'), config.client.id);

    await permissionRepository.create(new Permission('View Client Permission'), config.client.id);
    await permissionRepository.create(new Permission('Create Client Permission'), config.client.id);
    await permissionRepository.create(new Permission('Update Client Permission'), config.client.id);

    await roleRepository.create(new Role('Super User', new RoleGroup('Admin'), [
        new Permission('View Client'),
        new Permission('Create Client'),
        new Permission('Update Client'),
        new Permission('View Client User'),
        new Permission('Create Client User'),
        new Permission('Update Client User'),
        new Permission('View Client User'),
        new Permission('Create Client User'),
        new Permission('Update Client User'),
        new Permission('View Client Scope'),
        new Permission('Create Client Scope'),
        new Permission('Update Client Scope'),
        new Permission('View Client Redirect Uri'),
        new Permission('Create Client Redirect Uri'),
        new Permission('Update Client Redirect Uri'),
        new Permission('View Client Role Group'),
        new Permission('Create Client Role Group'),
        new Permission('Update Client Role Group'),
        new Permission('View Client Role'),
        new Permission('Create Client Role'),
        new Permission('Update Client Role'),
        new Permission('View Client Permission'),
        new Permission('Create Client Permission'),
        new Permission('Update Client Permission'),
    ]), config.client.id);

    await roleRepository.create(new Role('Standard User', new RoleGroup('Admin'), [
        new Permission('View Client'),
        new Permission('Create Client'),
        new Permission('Update Client'),
        new Permission('View Client User'),
        new Permission('Create Client User'),
        new Permission('Update Client User'),
        new Permission('View Client User'),
        new Permission('Create Client User'),
        new Permission('Update Client User'),
        new Permission('View Client Scope'),
        new Permission('Create Client Scope'),
        new Permission('Update Client Scope'),
        new Permission('View Client Redirect Uri'),
        new Permission('Create Client Redirect Uri'),
        new Permission('Update Client Redirect Uri'),
        new Permission('View Client Role Group'),
        new Permission('Create Client Role Group'),
        new Permission('Update Client Role Group'),
        new Permission('View Client Role'),
        new Permission('Create Client Role'),
        new Permission('Update Client Role'),
        new Permission('View Client Permission'),
        new Permission('Create Client Permission'),
        new Permission('Update Client Permission'),
    ]), config.client.id);

    const user: KetoneUser = await ketoneUserRepository.find('developersworkspace@gmail.com');
    user.role = new Role('Super User', new RoleGroup('Admin'), []);
    await ketoneUserRepository.update(user);

    // END

    await ketoneUserRepository.create(new KetoneUser(
        'demo',
        'developersworkspace@gmail.com',
        '6df0e8bca3a739f89b866f42d218a081', // 123456
        true,
        true,
        null,
        '0oms48rWZNJhuEreMKJs',
        null,
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
        null,
    ));

    await userRepository.create(new User('TestUser', 'testuser@example.com', '6df0e8bca3a739f89b866f42d218a081', false, true, null, new Role('Standard User', new RoleGroup('Admin'), [])), '7Ewz5a32gnkQz9iCvyk5');

    baseRepository.close();
}).catch((err: Error) => {
    console.error(err);
    baseRepository.close();
});
