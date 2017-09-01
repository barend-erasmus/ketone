// Imports models
import { Event } from './../../entities/event';

export class EventRepository {

    private events: Event[] = [];

    public async create(event: Event): Promise<boolean> {

        this.events.push(event);

        return true;
    }

    public async list(clientId: string): Promise<Event[]> {
        return this.events.filter((x) => x.clientId === clientId);
    }

    public async count(clientId: string, name: string, timestamp: Date): Promise<number> {
        return 0;
    }
}
