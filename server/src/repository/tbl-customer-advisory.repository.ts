import { EntityRepository, Repository } from 'typeorm';
import TblCustomerAdvisory from '../domain/tbl-customer-advisory.entity';

@EntityRepository(TblCustomerAdvisory)
export class TblCustomerAdvisoryRepository extends Repository<TblCustomerAdvisory> {}
