import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Promotion from '../domain/promotion.entity';
import { PromotionRepository } from '../repository/promotion.repository';
import { PromotionProductService } from './promotion-product.service';

const relationshipNames = [];
// relationshipNames.push('product');
relationshipNames.push('customerType');
relationshipNames.push('promotionItems');
relationshipNames.push('promotionProduct')
@Injectable()
export class PromotionService {
  logger = new Logger('PromotionService');

  constructor(
    @InjectRepository(PromotionRepository) private promotionRepository: PromotionRepository,
    private readonly promotionProductService: PromotionProductService
  ) {}

  async findById(id: string): Promise<Promotion | undefined> {
    const options = { relations: relationshipNames };
    const productList = await this.promotionProductService.findManyByfields({ where: { promotion: id } });
    const founded = await this.promotionRepository.findOne(id, options);
    founded.promotionProduct = productList;
    return founded;
  }

  async findByfields(options: FindOneOptions<Promotion>): Promise<Promotion | undefined> {
    return await this.promotionRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Promotion>): Promise<[Promotion[], number]> {
    options.relations = relationshipNames;
    return await this.promotionRepository.findAndCount(options);
  }

  async save(promotion: Promotion): Promise<Promotion | undefined> {
    const saved = await this.promotionRepository.save(promotion);
    const productList = await this.promotionProductService.findManyByfields({ where: { promotion: saved.id } });
    await this.promotionProductService.deleteMany(productList);
    if (Array.isArray(promotion.promotionProduct)) {
      const promoteProduct = promotion.promotionProduct.map(item => ({ ...item, promotion: saved }));
      await this.promotionProductService.saveList(promoteProduct);
    }

    return saved;
  }

  async update(promotion: Promotion): Promise<Promotion | undefined> {
    return await this.save(promotion);
  }

  async delete(promotion: Promotion): Promise<Promotion | undefined> {
    return await this.promotionRepository.remove(promotion);
  }
}
