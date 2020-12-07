import { EntityRepository, Repository } from 'typeorm';
import TblPromotionCustomerLevel from '../domain/tbl-promotion-customer-level.entity';

@EntityRepository(TblPromotionCustomerLevel)
export class TblPromotionCustomerLevelRepository extends Repository<TblPromotionCustomerLevel> {}
