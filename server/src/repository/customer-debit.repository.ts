import { EntityRepository, Repository } from 'typeorm';
import CustomerDebit from '../domain/customer-debit.entity';

@EntityRepository(CustomerDebit)
export class CustomerDebitRepository extends Repository<CustomerDebit> {}
