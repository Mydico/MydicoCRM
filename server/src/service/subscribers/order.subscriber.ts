import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import Order from '../../domain/order.entity';
import { Inject, CACHE_MANAGER } from '@nestjs/common';
import Cache from 'cache-manager';

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<Order> {
  constructor(connection: Connection, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Order;
  }

  async afterInsert(event: InsertEvent<Order>): Promise<any> {
    await event.manager.connection.queryResultCache.remove(['Order', 'orderId']);
  }

  async afterUpdate(event: InsertEvent<Order>): Promise<any> {
    event.manager.connection.queryResultCache.remove(['Order', 'orderId']);
  }
}
