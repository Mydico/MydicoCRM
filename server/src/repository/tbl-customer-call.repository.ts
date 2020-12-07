import { EntityRepository, Repository } from 'typeorm';
import TblCustomerCall from '../domain/tbl-customer-call.entity';

@EntityRepository(TblCustomerCall)
export class TblCustomerCallRepository extends Repository<TblCustomerCall> {}
