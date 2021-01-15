import { EntityRepository, Repository } from 'typeorm';
import PromotionProduct from '../domain/promotion-product.entity';

@EntityRepository(PromotionProduct)
export class PromotionProductRepository extends Repository<PromotionProduct> {}
