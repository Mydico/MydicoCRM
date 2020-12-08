import { EntityRepository, Repository } from 'typeorm';
import PromotionCustomerLevel from '../domain/promotion-customer-level.entity';

@EntityRepository(PromotionCustomerLevel)
export class PromotionCustomerLevelRepository extends Repository<PromotionCustomerLevel> {}
