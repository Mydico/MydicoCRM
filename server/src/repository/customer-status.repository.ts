import { EntityRepository, Repository } from 'typeorm';
import CustomerStatus from '../domain/customer-status.entity';

@EntityRepository(CustomerStatus)
export class CustomerStatusRepository extends Repository<CustomerStatus> {}
