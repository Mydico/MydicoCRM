import StoreInput from '../../domain/store-input.entity';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

@EventSubscriber()
export class StoreInputSubscriber implements EntitySubscriberInterface<StoreInput> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return StoreInput;
  }

  async afterInsert(event: InsertEvent<StoreInput>): Promise<any> {
    event.manager.connection.queryResultCache.remove(['get_StoreInputs']);
    event.manager.connection.queryResultCache.remove(["cache_count"]);
  }

  async afterUpdate(event: UpdateEvent<StoreInput>): Promise<any> {
    event.manager.connection.queryResultCache.remove(['get_StoreInputs']);
  }
}
