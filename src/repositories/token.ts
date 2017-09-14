// Imports models
import { Token } from './../entities/token';

export interface ITokenRepository {
    create(token: Token): Promise<boolean>;
    find(value: string): Promise<Token>;
}