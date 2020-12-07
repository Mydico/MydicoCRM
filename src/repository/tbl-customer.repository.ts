import { EntityRepository, Repository } from 'typeorm';
import TblCustomer from '../domain/tbl-customer.entity';

@EntityRepository(TblCustomer)
export class TblCustomerRepository extends Repository<TblCustomer> {}
