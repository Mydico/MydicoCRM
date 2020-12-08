import { EntityRepository, Repository } from 'typeorm';
import StoreInput from '../domain/store-input.entity';

@EntityRepository(StoreInput)
export class StoreInputRepository extends Repository<StoreInput> {}
