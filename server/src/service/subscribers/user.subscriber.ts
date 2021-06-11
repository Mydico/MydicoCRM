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
    event.manager.connection.queryResultCache.remove(['get_users']);
  }

  async afterUpdate(event: InsertEvent<User>): Promise<any> {
    event.manager.connection.queryResultCache.remove([event.entity.login]);
    event.manager.connection.queryResultCache.remove(['get_users']);
  }
}
