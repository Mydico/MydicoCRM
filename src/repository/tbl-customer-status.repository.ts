import { EntityRepository, Repository } from 'typeorm';
import TblCustomerStatus from '../domain/tbl-customer-status.entity';

@EntityRepository(TblCustomerStatus)
export class TblCustomerStatusRepository extends Repository<TblCustomerStatus> {}
