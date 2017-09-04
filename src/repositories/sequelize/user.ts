// Imports
import { IUserRepository } from './../user';
import { BaseRepository } from './base';

// Imports models
import { User } from './../../entities/user';
import { Role } from './../../entities/role';
import { Permission } from './../../entities/permission';
import { RoleGroup } from './../../entities/role-group';

export class UserRepository extends BaseRepository implements IUserRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(user: User, clientId: string): Promise<boolean> {

        const client: any = await BaseRepository.models.Client.find({
            where: {
                key: clientId,
            },
        });

        const role: any = user.role ? await BaseRepository.models.Role.find({
            include: [
                {
                    include: [
                        { model: BaseRepository.models.Client, required: false },
                    ],
                    model: BaseRepository.models.RoleGroup,
                    required: false
                },
            ],
            where: {
                'name': user.role.name,
                '$roleGroup.name$': user.role.group.name,
                '$roleGroup.client.key$': clientId,
            },
        }) : null;

        await BaseRepository.models.User.create({
            clientId: client.id,
            emailAddress: user.emailAddress,
            enabled: user.enabled,
            password: user.password,
            profileImage: user.profileImage,
            username: user.username,
            verified: user.verified,
            roleId: role ? role.id : null,
        });

        return true;
    }

    public async update(user: User, clientId: string): Promise<boolean> {
        const existingUser: any = await BaseRepository.models.User.find({
            include: [
                { model: BaseRepository.models.Client, required: false },
            ],
            where: {
                '$client.key$': clientId,
                'username': user.username,
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
                    required: false
                },
            ],
            where: {
                'name': user.role.name,
                '$roleGroup.name$': user.role.group.name,
                '$roleGroup.client.key$': clientId,
            },
        }) : null;

        existingUser.password = user.password;
        existingUser.verified = user.verified;
        existingUser.enabled = user.enabled;
        existingUser.roleId = role.id;

        await existingUser.save();

        return true;
    }

    public async find(username: string, clientId: string): Promise<User> {
        const user: any = await BaseRepository.models.User.find({
            include: [
                { model: BaseRepository.models.Client, required: false },
                {
                    include: [
                        {
                            model: BaseRepository.models.RoleGroup,
                            required: false
                        }
                    ],
                    model: BaseRepository.models.Role,
                    required: false
                },
            ],
            where: {
                '$client.key$': clientId,
                username,
            },
        });

        if (!user) {
            return null;
        }

        const permissions: any[] = await BaseRepository.models.RolePermissions.findAll({
            include: [
                { model: BaseRepository.models.Permission, required: false }
            ],
            where: {
                roleId: user.role.id
            },
        });

        return new User(
            user.username,
            user.emailAddress,
            user.password,
            user.verified,
            user.enabled,
            user.profileImage,
            user.role ? new Role(user.role.name, new RoleGroup(user.role.roleGroup.name), permissions.map((x) => new Permission(x.name))) : null,
        );
    }

    public async list(clientId: string): Promise<User[]> {
        const users: any[] = await BaseRepository.models.User.findAll({
            include: [
                { model: BaseRepository.models.Client, required: false },
            ],
            order: [
                ['username'],
            ],
            where: {
                '$client.key$': clientId,
            },
        });

        return users.map((x) => new User(x.username, x.emailAddress, x.password, x.verified, x.enabled, x.profileImage, null));
    }
}
