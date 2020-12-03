import { EntityRepository, Repository } from 'typeorm';
import TblPromotionItem from '../domain/tbl-promotion-item.entity';

@EntityRepository(TblPromotionItem)
export class TblPromotionItemRepository extends Repository<TblPromotionItem> {}
