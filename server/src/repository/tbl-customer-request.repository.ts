import { EntityRepository, Repository } from 'typeorm';
import TblCustomerRequest from '../domain/tbl-customer-request.entity';

@EntityRepository(TblCustomerRequest)
export class TblCustomerRequestRepository extends Repository<TblCustomerRequest> {}
