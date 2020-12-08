import { EntityRepository, Repository } from 'typeorm';
import CustomerRequest from '../domain/customer-request.entity';

@EntityRepository(CustomerRequest)
export class CustomerRequestRepository extends Repository<CustomerRequest> {}
