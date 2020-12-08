import { EntityRepository, Repository } from 'typeorm';
import StoreInputDetails from '../domain/store-input-details.entity';

@EntityRepository(StoreInputDetails)
export class StoreInputDetailsRepository extends Repository<StoreInputDetails> {}
