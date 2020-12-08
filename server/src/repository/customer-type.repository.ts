import { EntityRepository, Repository } from 'typeorm';
import CustomerType from '../domain/customer-type.entity';

@EntityRepository(CustomerType)
export class CustomerTypeRepository extends Repository<CustomerType> {}
