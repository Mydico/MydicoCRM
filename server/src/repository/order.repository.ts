import { EntityRepository, Repository } from 'typeorm';
import Order from '../domain/order.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
    async removeCache(key) {
        return await this.manager.connection.queryResultCache.remove(key);
    }
}
