import { EntityRepository, Repository } from 'typeorm';
import TblCustomerSkin from '../domain/tbl-customer-skin.entity';

@EntityRepository(TblCustomerSkin)
export class TblCustomerSkinRepository extends Repository<TblCustomerSkin> {}
