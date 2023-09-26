import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { User } from '../../domain/user.entity';
import PermissionGroup from 'src/domain/permission-group.entity';

@EventSubscriber()
export class PermissionGroupSubscriber implements EntitySubscriberInterface<PermissionGroup> {
    constructor(connection: Connection) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return User;
    }

    async afterInsert(event: InsertEvent<PermissionGroup>): Promise<any> {
        await event.manager.connection.queryResultCache.remove(['get_users','cache_count']);
    }

    async afterUpdate(event: UpdateEvent<PermissionGroup>): Promise<any> {
        await event.manager.connection.queryResultCache.remove(['-role']);
    }
}
