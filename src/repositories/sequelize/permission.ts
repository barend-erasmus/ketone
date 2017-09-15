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

    public async find(name: string, clientId: string): Promise<Permission> {
        const permission: any = await BaseRepository.models.Permission.find({
            include: [
                { model: BaseRepository.models.Client, required: false },
            ],
            where: {
                '$client.key$': clientId,
                'name': name,
            },
        });

        if (!permission) {
            return null;
        }

        return new Permission(permission.name);
    }

    public async listByClientId(clientId: string): Promise<Permission[]> {
        const permissions: any[] = await BaseRepository.models.Permission.findAll({
            include: [
                { model: BaseRepository.models.Client, required: false },
            ],
            where: {
                '$client.key$': clientId,
            },
        });

        return permissions.map((x) => new Permission(x.name));
    }

    public async update(permission: Permission, clientId: string): Promise<boolean> {
        return null;
    }
}
