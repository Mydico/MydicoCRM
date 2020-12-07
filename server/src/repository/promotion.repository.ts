import { EntityRepository, Repository } from 'typeorm';
import Promotion from '../domain/promotion.entity';

@EntityRepository(Promotion)
export class PromotionRepository extends Repository<Promotion> {}
