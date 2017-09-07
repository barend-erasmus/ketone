import { expect } from 'chai';
import 'mocha';
import * as moment from 'moment';

import { KetoneUserRepository } from './../repositories/memory/ketone-user';
import { KetoneUserService } from './ketone-user';

import { KetoneUser } from './../entities/ketone-user';

describe('KetoneUserService', () => {

    let ketoneUserService: KetoneUserService = null;

    describe('find', () => {
        it('should return user', async () => {
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            ketoneUserService = new KetoneUserService(ketoneUserRepository);

            await ketoneUserRepository.create(new KetoneUser('user', 'user@example.com', '123456', true, true, null, 'xyz', null));

            const user: KetoneUser = await ketoneUserService.find('user');

            expect(user).to.be.not.null;
        });

        it('should return null given username does not exist', async () => {
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            ketoneUserService = new KetoneUserService(ketoneUserRepository);

            const user: KetoneUser = await ketoneUserService.find('user');

            expect(user).to.be.null;
        });
    });

    describe('findByAPIKey', () => {
        it('should return user', async () => {
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            ketoneUserService = new KetoneUserService(ketoneUserRepository);

            await ketoneUserRepository.create(new KetoneUser('user', 'user@example.com', '123456', true, true, null, 'xyz', null));

            const user: KetoneUser = await ketoneUserService.findByAPIKey('xyz');

            expect(user).to.be.not.null;
        });

        it('should return null given api key does not exist', async () => {
            const ketoneUserRepository: KetoneUserRepository = new KetoneUserRepository();
            ketoneUserService = new KetoneUserService(ketoneUserRepository);

            const user: KetoneUser = await ketoneUserService.findByAPIKey('xyz');

            expect(user).to.be.null;
        });
    });
});
