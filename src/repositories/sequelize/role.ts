// Imports
import { IRoleRepository } from './../role';
import { BaseRepository } from './base';

// Imports models
import { Permission } from './../../entities/permission';
import { Role } from './../../entities/role';
import { RoleGroup } from './../../entities/role-group';

export class RoleRepository extends BaseRepository implements IRoleRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(role: Role, clientId: string): Promise<boolean> {
        const roleGroup: any = await BaseRepository.models.RoleGroup.find({
            include: [
                { model: BaseRepository.models.Client, required: false },
            ],
            where: {
                '$client.key$': clientId,
                'name': role.group.name,
            },
        });

        const existingRole: any = await BaseRepository.models.Role.create({
            name: role.name,
            roleGroupId: roleGroup.id,
        });

        for (const permission of role.permissions) {

            const existingPermission: any = await BaseRepository.models.Permission.find({
                include: [
                    { model: BaseRepository.models.Client, required: false },
                ],
                where: {
                    '$client.key$': clientId,
                    'name': permission.name,
                },
            });

            await BaseRepository.models.RolePermissions.create({
                permissionId: existingPermission.id,
                roleId: existingRole.id,
            });
        }

        return true;
    }

    public async update(role: Role, clientId: string): Promise<boolean> {
        const existingRole: any = await BaseRepository.models.Role.find({
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
                '$roleGroup.client.key$': clientId,
                '$roleGroup.name$': role.group,
                'name': name,
            },
        });

        const rolePermissions: any[] = await BaseRepository.models.RolePermissions.findAll({
            include: [
                {
                    include: [
                        {
                            include: [
                                { model: BaseRepository.models.Client, required: false },
                            ],
                            model: BaseRepository.models.RoleGroup,
                            required: false,
                        },
                    ],
                    model: BaseRepository.models.Role,
                    required: false,
                },
                { model: BaseRepository.models.Permission, required: false },
            ],
            where: {
                '$role.name$': role.name,
                '$role.roleGroup.client.key$': clientId,
            },
        });

        for (const permission of role.permissions) {

            if (rolePermissions.find((x) => x.permission.name === permission.name)) {
                continue;
            }

            const existingPermission: any = await BaseRepository.models.Permission.find({
                include: [
                    { model: BaseRepository.models.Client, required: false },
                ],
                where: {
                    '$client.key$': clientId,
                    'name': permission.name,
                },
            });

            await BaseRepository.models.RolePermissions.create({
                permissionId: existingPermission.id,
                roleId: existingRole.id,
            });
        }

        return true;
    }

    public async listByClientId(clientId: string): Promise<Role[]> {
        const roles: any[] = await BaseRepository.models.Role.findAll({
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
                '$roleGroup.client.key$': clientId,
            },
        });

        const result: Role[] = [];

        for (const role of roles) {
            const loadedRole: Role = await this.loadPermissions(new Role(role.name, new RoleGroup(role.roleGroup.name), null), clientId);
            result.push(loadedRole);
        }

        return result;
    }

    public async find(name: string, group: string, clientId: string): Promise<Role> {
        const role: any = await BaseRepository.models.Role.find({
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
                '$roleGroup.client.key$': clientId,
                '$roleGroup.name$': group,
                'name': name,
            },
        });

        const loadedRole: Role = await this.loadPermissions(new Role(role.name, new RoleGroup(role.roleGroup.name), null), clientId);

        return loadedRole;
    }

    public async listByUsername(username: string, clientId: string): Promise<Role[]> {
        return null;
    }

    public async listPermissions(username: string, clientId: string): Promise<Permission[]> {
        return null;
    }

    private async loadPermissions(role: Role, clientId: string): Promise<Role> {
        const rolePermissions: any[] = await BaseRepository.models.RolePermissions.findAll({
            include: [
                {
                    include: [
                        {
                            include: [
                                { model: BaseRepository.models.Client, required: false },
                            ],
                            model: BaseRepository.models.RoleGroup,
                            required: false,
                        },
                    ],
                    model: BaseRepository.models.Role,
                    required: false,
                },
                { model: BaseRepository.models.Permission, required: false },
            ],
            where: {
                '$role.name$': role.name,
                '$role.roleGroup.client.key$': clientId,
            },
        });

        role.permissions = rolePermissions.map((x) => new Permission(x.permission.name));

        return role;

    }
}
