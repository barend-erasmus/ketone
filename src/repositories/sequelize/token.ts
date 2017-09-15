// Imports
import * as uuid from 'uuid';
import { ITokenRepository } from './../token';
import { BaseRepository } from './base';

// Imports models
import { Token } from './../../entities/token';

export class TokenRepository extends BaseRepository implements ITokenRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(token: Token): Promise<boolean> {
        await BaseRepository.models.Token.create({
            clientId: token.clientId,
            scopes: token.scopes && token.scopes.length > 0 ? token.scopes.join(',') : null,
            type: token.type,
            username: token.username,
            value: token.value,
        });

        return true;
    }

    public async find(value: string): Promise<Token> {
        const token: any = await BaseRepository.models.Token.find({
            where: {
                value,
            },
        });

        if (!token) {
            return null;
        }

        return new Token(value, token.clientId, token.username, token.scopes ? token.scopes.split(',') : null, token.type, token.createdAt);
    }
}
