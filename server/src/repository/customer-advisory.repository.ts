import { EntityRepository, Repository } from 'typeorm';
import CustomerAdvisory from '../domain/customer-advisory.entity';

@EntityRepository(CustomerAdvisory)
export class CustomerAdvisoryRepository extends Repository<CustomerAdvisory> {}
