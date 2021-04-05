import { EntityRepository, Repository } from 'typeorm';
import StoreHistory from '../domain/store-history.entity';

@EntityRepository(StoreHistory)
export class StoreHistoryRepository extends Repository<StoreHistory> {}
