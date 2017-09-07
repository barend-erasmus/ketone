import { expect } from 'chai';
import 'mocha';

import { ClientRepository } from './../repositories/memory/client';
import { PermissionRepository } from './../repositories/memory/permission';
import { PermissionService } from './permission';

import { Client } from './../entities/client';
import { Permission } from './../entities/permission';

describe('PermissionService', () => {

    let permissionService: PermissionService = null;

    describe('create', () => {
        it('should return permission', async () => {
            const permissionRepository: PermissionRepository = new PermissionRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            permissionService = new PermissionService(permissionRepository, clientRepository);

            await clientRepository.create(new Client('client-name', 'client-id', 'client-secret', [], [], true, true, 'user', null));

            const result: Permission = await permissionService.create('user', 'permission', 'client-id');

            expect(result).to.be.not.null;
        });

        it('should throw error given permission already exist', async () => {
            const permissionRepository: PermissionRepository = new PermissionRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            permissionService = new PermissionService(permissionRepository, clientRepository);

            await clientRepository.create(new Client('client-name', 'client-id', 'client-secret', [], [], true, true, 'user', null));

            await permissionService.create('user', 'permission', 'client-id');

            try {
                await permissionService.create('user', 'permission', 'client-id');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Permission already exist');
            }
        });

        it('should throw error given client id does not exist', async () => {
            const permissionRepository: PermissionRepository = new PermissionRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            permissionService = new PermissionService(permissionRepository, clientRepository);

            try {
                await permissionService.create('user', 'permission', 'client-id');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Invalid Client Id');
            }
        });

        it('should throw error given user does not own client', async () => {
            const permissionRepository: PermissionRepository = new PermissionRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            permissionService = new PermissionService(permissionRepository, clientRepository);

            await clientRepository.create(new Client('client-name', 'client-id', 'client-secret', [], [], true, true, 'user', null));

            try {
                await permissionService.create('other-user', 'permission', 'client-id');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('You are not the owner of this Client Id');
            }
        });
    });
});
