import { EntityRepository, Repository } from 'typeorm';
import TblStore from '../domain/tbl-store.entity';

@EntityRepository(TblStore)
export class TblStoreRepository extends Repository<TblStore> {}
