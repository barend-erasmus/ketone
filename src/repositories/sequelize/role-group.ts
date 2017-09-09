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

        await BaseRepository.models.RoleGroup.create({
            clientId: client.id,
            name: roleGroup.name,
        });

        return true;
    }

    public async list(clientId: string): Promise<RoleGroup[]> {
        const roleGroups: any[] = await BaseRepository.models.RoleGroup.findAll({
            include: [
                {
                    model: BaseRepository.models.Client,
                    required: false,
                },
            ],
            where: {
                '$client.key$': clientId,
            },
        });

        return roleGroups.map((x) => new RoleGroup(x.name));
    }

    public async find(name: string, clientId: string): Promise<RoleGroup> {
        const roleGroup: any = await BaseRepository.models.RoleGroup.find({
            include: [
                { model: BaseRepository.models.Client, required: false },
            ],
            where: {
                '$roleGroup.client.key$': clientId,
                'name': name,
            },
        });

        if (!roleGroup) {
            return null;
        }

        return new RoleGroup(roleGroup.name);
    }

    public async update(roleGroup: RoleGroup, clientId: string): Promise<boolean> {
        return null;
    }
}
