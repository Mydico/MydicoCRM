import { EntityRepository, Repository } from 'typeorm';
import StoreInput from '../domain/store-input.entity';

@EntityRepository(StoreInput)
export class StoreInputRepository extends Repository<StoreInput> {
    async removeCache(key) {
        return await this.manager.connection.queryResultCache.remove(key);
    }
}
