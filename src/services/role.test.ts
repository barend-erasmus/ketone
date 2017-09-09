import { expect } from 'chai';
import 'mocha';

import { ClientRepository } from './../repositories/memory/client';
import { RoleRepository } from './../repositories/memory/role';
import { RoleGroupRepository } from './../repositories/memory/role-group';
import { RoleService } from './role';

import { Client } from './../entities/client';
import { Role } from './../entities/role';

describe('RoleService', () => {

    let roleService: RoleService = null;

    describe('create', () => {
        it('should return role', async () => {
            const roleRepository: RoleRepository = new RoleRepository();
            const roleGroupRepository: RoleGroupRepository = new RoleGroupRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            roleService = new RoleService(roleRepository, roleGroupRepository, clientRepository);

            await clientRepository.create(new Client('client-name', 'client-id', 'client-secret', [], [], true, true, 'user', null));

            const result: Role = await roleService.create('user', 'role', 'role-group', 'client-id');

            expect(result).to.be.not.null;
        });

        it('should throw error given role already exist', async () => {
            const roleRepository: RoleRepository = new RoleRepository();
            const roleGroupRepository: RoleGroupRepository = new RoleGroupRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            roleService = new RoleService(roleRepository, roleGroupRepository, clientRepository);

            await clientRepository.create(new Client('client-name', 'client-id', 'client-secret', [], [], true, true, 'user', null));

            await roleService.create('user', 'role', 'role-group', 'client-id');

            try {
                await roleService.create('user', 'role', 'role-group', 'client-id');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Role already exist');
            }
        });

        it('should throw error given client id does not exist', async () => {
            const roleRepository: RoleRepository = new RoleRepository();
            const roleGroupRepository: RoleGroupRepository = new RoleGroupRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            roleService = new RoleService(roleRepository, roleGroupRepository, clientRepository);

            try {
                await roleService.create('user', 'role', 'role-group', 'client-id');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Invalid Client Id');
            }
        });

        it('should throw error given user does not own client', async () => {
            const roleRepository: RoleRepository = new RoleRepository();
            const roleGroupRepository: RoleGroupRepository = new RoleGroupRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            roleService = new RoleService(roleRepository, roleGroupRepository, clientRepository);

            await clientRepository.create(new Client('client-name', 'client-id', 'client-secret', [], [], true, true, 'user', null));

            try {
                await roleService.create('other-user', 'role', 'role-group', 'client-id');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('You are not the owner of this Client Id');
            }
        });
    });

    describe('list', () => {
        it('should return list of permissions', async () => {
            const roleRepository: RoleRepository = new RoleRepository();
            const roleGroupRepository: RoleGroupRepository = new RoleGroupRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            roleService = new RoleService(roleRepository, roleGroupRepository, clientRepository);

            await clientRepository.create(new Client('client-name', 'client-id', 'client-secret', [], [], true, true, 'user', null));

            await roleService.create('user', 'role', 'role-group', 'client-id');

            const result: Role[] = await roleService.list('user', 'client-id');

            expect(result.length).to.be.eq(1);
        });

        it('should throw error given client id does not exist', async () => {
            const roleRepository: RoleRepository = new RoleRepository();
            const roleGroupRepository: RoleGroupRepository = new RoleGroupRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            roleService = new RoleService(roleRepository, roleGroupRepository, clientRepository);

            try {
                await roleService.list('user', 'client-id');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('Invalid Client Id');
            }
        });

        it('should throw error given user does not own client', async () => {
            const roleRepository: RoleRepository = new RoleRepository();
            const roleGroupRepository: RoleGroupRepository = new RoleGroupRepository();
            const clientRepository: ClientRepository = new ClientRepository();
            roleService = new RoleService(roleRepository, roleGroupRepository, clientRepository);

            await clientRepository.create(new Client('client-name', 'client-id', 'client-secret', [], [], true, true, 'user', null));

            try {
                await roleService.list('other-user', 'client-id');
                throw new Error('Expected Error');
            } catch (err) {
                expect(err.message).to.be.eq('You are not the owner of this Client Id');
            }
        });
    });
});
