// Imports
import { IPermissionRepository } from './../permission';
import { BaseRepository } from './base';

// Imports models
import { Permission } from './../../entities/permission';
export class PermissionRepository extends BaseRepository implements IPermissionRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(permission: Permission, clientId: string): Promise<boolean> {

        const client: any = await BaseRepository.models.Client.find({
            where: {
                key: clientId,
            },
        });

        await BaseRepository.models.Permission.create({
            clientId: client.id,
            name: permission.name,
        });

        return true;
    }

    public async update(permission: Permission, clientId: string): Promise<boolean> {
        return null;
    }
}
