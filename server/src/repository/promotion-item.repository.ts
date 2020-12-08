import { EntityRepository, Repository } from 'typeorm';
import PromotionItem from '../domain/promotion-item.entity';

@EntityRepository(PromotionItem)
export class PromotionItemRepository extends Repository<PromotionItem> {}
