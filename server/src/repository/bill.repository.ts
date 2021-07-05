import { EntityRepository, Repository } from 'typeorm';
import Bill from '../domain/bill.entity';

@EntityRepository(Bill)
export class BillRepository extends Repository<Bill> {
  async removeCache(key) {
    return await this.manager.connection.queryResultCache.remove(key);
  }
}
