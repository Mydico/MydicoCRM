import { EntityRepository, Repository } from 'typeorm';
import TblCustomerTemp from '../domain/tbl-customer-temp.entity';

@EntityRepository(TblCustomerTemp)
export class TblCustomerTempRepository extends Repository<TblCustomerTemp> {}
