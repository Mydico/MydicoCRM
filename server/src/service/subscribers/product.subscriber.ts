import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import Product from '../../domain/product.entity';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Product;
  }

  async afterInsert(event: InsertEvent<Product>): Promise<any> {
    event.manager.connection.queryResultCache.remove(["get_products"]);
    event.manager.connection.queryResultCache.remove(["cache_count_get_products"]);
  }

  async afterUpdate(event: InsertEvent<Product>): Promise<any> {
    event.manager.connection.queryResultCache.remove(["get_products"]);
  }
}
