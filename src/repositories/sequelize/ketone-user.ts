// Imports
import { IKetoneUserRepository } from './../ketone-user';
import { BaseRepository } from './base';
import { config } from './../../config';

// Imports models
import { KetoneUser } from './../../entities/ketone-user';
import { Role } from './../../entities/role';
import { RoleGroup } from './../../entities/role-group';
import { Permission } from './../../entities/permission';

export class KetoneUserRepository extends BaseRepository implements IKetoneUserRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(user: KetoneUser): Promise<boolean> {

        const role: any = user.role ? await BaseRepository.models.Role.find({
            include: [
                {
                    include: [
                        { model: BaseRepository.models.Client, required: false },
                    ],
                    model: BaseRepository.models.RoleGroup,
                    required: false,
                },
            ],
            where: {
                '$roleGroup.client.key$': config.client.id,
                '$roleGroup.name$': user.role.group.name,
                'name': user.role.name,
            },
        }) : null;

        await BaseRepository.models.KetoneUser.create({
            apiKey: user.apiKey,
            emailAddress: user.emailAddress,
            enabled: user.enabled,
            password: user.password,
            profileImage: user.profileImage,
            roleId: role ? role.id : null,
            username: user.username,
            verified: user.verified,
        });

        return true;
    }

    public async update(user: KetoneUser): Promise<boolean> {
        const existingUser: any = await BaseRepository.models.KetoneUser.find({
            where: {
                username: user.username,
            },
        });

        if (!user) {
            return false;
        }

        const role: any = user.role ? await BaseRepository.models.Role.find({
            include: [
                {
                    include: [
                        { model: BaseRepository.models.Client, required: false },
                    ],
                    model: BaseRepository.models.RoleGroup,
                    required: false,
                },
            ],
            where: {
                '$roleGroup.client.key$': config.client.id,
                '$roleGroup.name$': user.role.group.name,
                'name': user.role.name,
            },
        }) : null;


        existingUser.password = user.password;
        existingUser.verified = user.verified;
        existingUser.enabled = user.enabled;
        existingUser.roleId = role? role.id : null;

        await existingUser.save();

        return true;
    }

    public async findByAPIKey(apiKey: string): Promise<KetoneUser> {
        const user: any = await BaseRepository.models.KetoneUser.find({
            include: [
                {
                    include: [
                        {
                            model: BaseRepository.models.RoleGroup,
                            required: false,
                        },
                    ],
                    model: BaseRepository.models.Role,
                    required: false,
                },
            ],
            where: {
                apiKey,
            },
        });

        if (!user) {
            return null;
        }

        const rolePermission: any[] = user.role? await BaseRepository.models.RolePermissions.findAll({
            include: [
                { model: BaseRepository.models.Permission, required: false },
            ],
            where: {
                roleId: user.role.id,
            },
        }) : null;


        return new KetoneUser(
            user.username,
            user.emailAddress,
            user.password,
            user.verified,
            user.enabled,
            user.profileImage,
            user.apiKey,
            user.role ? new Role(user.role.name, new RoleGroup(user.role.roleGroup.name), rolePermission.map((x) => new Permission(x.permission.name))) : null,
        );
    }

    public async find(username: string): Promise<KetoneUser> {
        const user: any = await BaseRepository.models.KetoneUser.find({
            include: [
                {
                    include: [
                        {
                            model: BaseRepository.models.RoleGroup,
                            required: false,
                        },
                    ],
                    model: BaseRepository.models.Role,
                    required: false,
                },
            ],
            where: {
                username,
            },
        });

        if (!user) {
            return null;
        }

        const rolePermission: any[] = user.role? await BaseRepository.models.RolePermissions.findAll({
            include: [
                { model: BaseRepository.models.Permission, required: false },
            ],
            where: {
                roleId: user.role.id,
            },
        }) : null

        return new KetoneUser(
            user.username,
            user.emailAddress,
            user.password,
            user.verified,
            user.enabled,
            user.profileImage,
            user.apiKey,
            user.role ? new Role(user.role.name, new RoleGroup(user.role.roleGroup.name), rolePermission.map((x) => new Permission(x.permission.name))) : null,
        );
    }

    public async list(): Promise<KetoneUser[]> {
        const users: any[] = await BaseRepository.models.KetoneUser.findAll({
            include: [
                {
                    include: [
                        {
                            model: BaseRepository.models.RoleGroup,
                            required: false,
                        },
                    ],
                    model: BaseRepository.models.Role,
                    required: false,
                },
            ],
            order: [
                ['username'],
            ],
        });

        const result: KetoneUser[] = [];

        for (const user of users) {
            const loadedUser: KetoneUser = new KetoneUser(
                user.username,
                user.emailAddress,
                user.password,
                user.verified,
                user.enabled,
                user.profileImage,
                user.apiKey,
                user.role ? new Role(user.role.name, new RoleGroup(user.role.roleGroup.name), null) : null,
            );

            if (loadedUser.role) {
                const rolePermission: any[] = await BaseRepository.models.RolePermissions.findAll({
                    include: [
                        { model: BaseRepository.models.Permission, required: false },
                    ],
                    where: {
                        roleId: user.role.id,
                    },
                });

                loadedUser.role.permissions = rolePermission.map((x) => new Permission(x.permission.name));
            }

            result.push(loadedUser);
        }

        return result;
    }
}
