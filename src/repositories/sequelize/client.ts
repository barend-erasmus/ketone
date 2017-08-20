// Imports
import { BaseRepository } from './base';

// Imports models
import { Client } from './../../entities/client';

export class ClientRepository extends BaseRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(client: Client, ketoneUsername: string): Promise<boolean> {

        const ketoneUser: any = await BaseRepository.models.KetoneUser.find({
            where: {
                username: ketoneUsername,
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
                { model: BaseRepository.models.AllowedScope, required: false },
                { model: BaseRepository.models.RedirectUri, required: false },
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
        );
    }
}
