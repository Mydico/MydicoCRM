import { EntityRepository, Repository } from 'typeorm';
import TblCustomerMap from '../domain/tbl-customer-map.entity';

@EntityRepository(TblCustomerMap)
export class TblCustomerMapRepository extends Repository<TblCustomerMap> {}
