// Imports
import { IRoleRepository } from './../role';
import { BaseRepository } from './base';

// Imports models
import { Permission } from './../../entities/permission';
import { Role } from './../../entities/role';

export class RoleRepository extends BaseRepository implements IRoleRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(role: Role, clientId: string): Promise<boolean> {
        const client: any = await BaseRepository.models.Client.find({
            where: {
                key: clientId,
            },
        });

        await BaseRepository.models.Roles.create({
            clientId: client.id,
            name: role.name,
        });

        return true;
    }

    public async update(role: Role, clientId: string): Promise<boolean> {
        return null;
    }

    public async listByClientId(clientId: string): Promise<Role[]> {
        const roles: any[] = await BaseRepository.models.Roles.findAll({
            include: [
                { model: BaseRepository.models.Client, required: false },
            ],
            where: {
                '$client.key$': clientId,
            },
        });

        return roles.map((x) => new Role(x.name, []));
    }

    public async listByUsername(username: string, clientId: string): Promise<Role[]> {
        return null;
    }

    public async listPermissions(username: string, clientId: string): Promise<Permission[]> {
        return null;
    }
}
