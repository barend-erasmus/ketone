// Imports models
import { Client } from './../entities/client';

export interface IClientRepository {

    create(client: Client): Promise<boolean>;

    find(id: string): Promise<Client>;

    update(client: Client): Promise<boolean>;

    listByUsername(username: string): Promise<Client[]>;
}
