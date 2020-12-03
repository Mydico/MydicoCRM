import { EntityRepository, Repository } from 'typeorm';
import TblCustomerType from '../domain/tbl-customer-type.entity';

@EntityRepository(TblCustomerType)
export class TblCustomerTypeRepository extends Repository<TblCustomerType> {}
