// Imports
import * as Sequelize from 'sequelize';
import { BaseRepository } from './base';

// Imports models
import { Event } from './../../entities/event';

export class EventRepository extends BaseRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(event: Event): Promise<boolean> {
        await BaseRepository.models.Event.create({
            clientId: event.clientId,
            name: event.name,
            username: event.username,
        });

        return true;
    }

    public async count(clientId: string, name: string, timestamp: Date): Promise<number> {
        const result: any = await BaseRepository.models.Event.findAll({
            attributes: [[Sequelize.fn('COUNT', Sequelize.col('name')), 'count']],
            where: {
                clientId,
                createdAt: {
                    $lte: timestamp,
                },
                name,
            },
        });

        return parseInt(result[0].dataValues.count, undefined);
    }
}
