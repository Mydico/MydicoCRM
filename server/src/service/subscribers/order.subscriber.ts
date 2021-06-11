import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import Order from '../../domain/order.entity';

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<Order> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Order;
  }

  async afterInsert(event: InsertEvent<Order>): Promise<any> {
    // event.manager.connection.queryResultCache.remove(["get_orders"]);
  }

  async afterUpdate(event: InsertEvent<Order>): Promise<any> {
    // event.manager.connection.queryResultCache.remove(["get_orders"]);
  }
}
