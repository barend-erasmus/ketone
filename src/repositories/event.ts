// Imports models
import { Event } from './../entities/event';

export interface IEventRepository {

    create(event: Event): Promise<boolean>;

    count(clientId: string, name: string, timestamp: Date): Promise<number>;
}
