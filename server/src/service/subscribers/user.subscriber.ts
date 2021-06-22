import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { User } from '../../domain/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    constructor(connection: Connection) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return User;
    }

    async afterInsert(event: InsertEvent<User>): Promise<any> {
        await event.manager.connection.queryResultCache.remove(['get_users','cache_count']);
    }

    async afterUpdate(event: UpdateEvent<User>): Promise<any> {
        await event.manager.connection.queryResultCache.remove([event.entity.login,'get_users']);
    }
}
