import { EntityRepository, Repository } from 'typeorm';
import TblStoreInput from '../domain/tbl-store-input.entity';

@EntityRepository(TblStoreInput)
export class TblStoreInputRepository extends Repository<TblStoreInput> {}
