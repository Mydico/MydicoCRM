import { EntityRepository, Repository } from 'typeorm';
import TblStoreInputDetails from '../domain/tbl-store-input-details.entity';

@EntityRepository(TblStoreInputDetails)
export class TblStoreInputDetailsRepository extends Repository<TblStoreInputDetails> {}
