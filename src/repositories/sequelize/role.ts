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

        const existingRole: any =await BaseRepository.models.Role.create({
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
                roleId: existingRole.id,
                permissionId: existingPermission.id, 
            });
        }

        return true;
    }

    public async update(role: Role, clientId: string): Promise<boolean> {
        return null;
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

        return roles.map((x) => new Role(x.name, new RoleGroup(x.roleGroup.name), []));
    }

    public async listByUsername(username: string, clientId: string): Promise<Role[]> {
        return null;
    }

    public async listPermissions(username: string, clientId: string): Promise<Permission[]> {
        return null;
    }
}
