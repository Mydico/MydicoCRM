import { EntityRepository, Repository } from 'typeorm';
import Store from '../domain/store.entity';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {
    async removeCache(key) {
        return await this.manager.connection.queryResultCache.remove(key);
    }
}
