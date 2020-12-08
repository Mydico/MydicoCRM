import { EntityRepository, Repository } from 'typeorm';
import CustomerMap from '../domain/customer-map.entity';

@EntityRepository(CustomerMap)
export class CustomerMapRepository extends Repository<CustomerMap> {}
