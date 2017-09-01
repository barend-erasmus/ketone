// Imports
import { IRoleGroupRepository } from './../role-group';
import { BaseRepository } from './base';

// Imports models
import { RoleGroup } from './../../entities/role-group';

export class RoleGroupRepository extends BaseRepository implements IRoleGroupRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(roleGroup: RoleGroup, clientId: string): Promise<boolean> {
        const client: any = await BaseRepository.models.Client.find({
            where: {
                key: clientId,
            },
        });

        await BaseRepository.models.RoleGroups.create({
            clientId: client.id,
            name: roleGroup.name,
        });

        return true;
    }

    public async update(roleGroup: RoleGroup, clientId: string): Promise<boolean> {
        return null;
    }
}
