import { EntityRepository, Repository } from 'typeorm';
import Product from '../domain/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
    async removeCache(key) {
        return await this.manager.connection.queryResultCache.remove(key);
    }
}
