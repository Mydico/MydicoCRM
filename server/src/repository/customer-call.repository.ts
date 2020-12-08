import { EntityRepository, Repository } from 'typeorm';
import CustomerCall from '../domain/customer-call.entity';

@EntityRepository(CustomerCall)
export class CustomerCallRepository extends Repository<CustomerCall> {}
