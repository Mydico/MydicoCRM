import { EntityRepository, Repository } from 'typeorm';
import CustomerTemp from '../domain/customer-temp.entity';

@EntityRepository(CustomerTemp)
export class CustomerTempRepository extends Repository<CustomerTemp> {}
