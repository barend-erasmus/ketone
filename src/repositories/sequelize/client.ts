// Imports
import { IClientRepository } from './../client';
import { BaseRepository } from './base';

// Imports models
import { Client } from './../../entities/client';
import { Permission } from './../../entities/permission';
import { Role } from './../../entities/role';
import { RoleGroup } from './../../entities/role-group';

export class ClientRepository extends BaseRepository implements IClientRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(client: Client): Promise<boolean> {

        const ketoneUser: any = await BaseRepository.models.KetoneUser.find({
            where: {
                username: client.username,
            },
        });

        await BaseRepository.models.Client.create({
            allowForgotPassword: client.allowForgotPassword,
            allowRegister: client.allowRegister,
            allowedScopes: client.allowedScopes.map((x) => {
                return {
                    name: x,
                };
            }),
            ketoneUserId: ketoneUser.id,
            key: client.id,
            name: client.name,
            redirectUris: client.redirectUris.map((x) => {
                return {
                    uri: x,
                };
            }),
            secret: client.secret,
        }, {
                include: [
                    { model: BaseRepository.models.AllowedScope },
                    { model: BaseRepository.models.RedirectUri },
                ],
            });

        return true;
    }

    public async find(id: string): Promise<Client> {
        const client: any = await BaseRepository.models.Client.find({
            include: [
                { model: BaseRepository.models.KetoneUser, required: false },
                { model: BaseRepository.models.AllowedScope, required: false },
                { model: BaseRepository.models.RedirectUri, required: false },
                {
                    as: 'defaultRole',
                    include: [
                        { model: BaseRepository.models.RoleGroup, required: false },
                    ],
                    model: BaseRepository.models.Role,
                    required: false,
                },
            ],
            where: {
                key: id,
            },
        });

        if (!client) {
            return null;
        }

        return new Client(
            client.name,
            client.key,
            client.secret,
            client.allowedScopes.map((x) => x.name),
            client.redirectUris.map((x) => x.uri),
            client.allowForgotPassword,
            client.allowRegister,
            client.ketoneUser.username,
            client.defaultRole ? new Role(client.defaultRole.name, new RoleGroup(client.defaultRole.roleGroup.name), []) : null,
        );
    }

    public async update(client: Client): Promise<boolean> {
        const existingClient: any = await BaseRepository.models.Client.find({
            include: [
                { model: BaseRepository.models.AllowedScope, required: false },
                { model: BaseRepository.models.RedirectUri, required: false },
            ],
            where: {
                key: client.id,
            },
        });

        if (!existingClient) {
            return null;
        }

        const role: any = client.role ? await BaseRepository.models.Role.find({
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
                '$roleGroup.client.key$': client.id,
                '$roleGroup.name$': client.role.group.name,
                'name': client.role.name,
            },
        }) : null;

        existingClient.name = client.name;
        existingClient.allowForgotPassword = client.allowForgotPassword;
        existingClient.allowRegister = client.allowRegister;
        existingClient.defaultRoleId = role ? role.id : null;

        for (const scope of existingClient.allowedScopes) {
            if (client.allowedScopes.filter((x) => x === scope.name).length === 0) {
                await BaseRepository.models.AllowedScope.destroy({
                    where: {
                        id: scope.id,
                    },
                });
            }
        }

        for (const scope of client.allowedScopes) {
            if (existingClient.allowedScopes.filter((x) => x.name === scope).length === 0) {
                await BaseRepository.models.AllowedScope.create({
                    clientId: existingClient.id,
                    name: scope,
                });
            }
        }

        for (const redirectUri of existingClient.redirectUris) {
            if (client.redirectUris.filter((x) => x === redirectUri.uri).length === 0) {
                await BaseRepository.models.RedirectUri.destroy({
                    where: {
                        id: redirectUri.id,
                    },
                });
            }
        }

        for (const redirectUri of client.redirectUris) {
            if (existingClient.redirectUris.filter((x) => x.uri === redirectUri).length === 0) {
                await BaseRepository.models.RedirectUri.create({
                    clientId: existingClient.id,
                    uri: redirectUri,
                });
            }
        }

        await existingClient.save();

        return true;
    }

    public async listByUsername(username: string): Promise<Client[]> {
        const clients: any[] = await BaseRepository.models.Client.findAll({
            include: [
                { model: BaseRepository.models.KetoneUser, required: false },
                { model: BaseRepository.models.AllowedScope, required: false },
                { model: BaseRepository.models.RedirectUri, required: false },
                {
                    as: 'defaultRole',
                    include: [
                        { model: BaseRepository.models.RoleGroup, required: false },
                    ],
                    model: BaseRepository.models.Role,
                    required: false,
                },
            ],
            where: {
                '$ketoneUser.username$': username,
            },
        });

        return clients.map((x) => new Client(
            x.name,
            x.key,
            x.secret,
            x.allowedScopes.map((y) => y.name),
            x.redirectUris.map((y) => y.uri),
            x.allowForgotPassword,
            x.allowRegister,
            x.ketoneUser.username,
            x.defaultRole ? new Role(x.defaultRole.name, new RoleGroup(x.defaultRole.roleGroup.name), []) : null,
        ));
    }
}
