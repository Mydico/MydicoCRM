import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionType } from '../domain/enumeration/promotion-type';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Promotion from '../domain/promotion.entity';
import { PromotionRepository } from '../repository/promotion.repository';
import { PromotionItemService } from './promotion-item.service';
import { PromotionProductService } from './promotion-product.service';

const relationshipNames = [];
// relationshipNames.push('product');
relationshipNames.push('customerType');
relationshipNames.push('promotionItems');
relationshipNames.push('promotionItems.productGroup');
relationshipNames.push('promotionProduct');
relationshipNames.push('promotionProduct.product');

@Injectable()
export class PromotionService {
    logger = new Logger('PromotionService');

    constructor(
        @InjectRepository(PromotionRepository) private promotionRepository: PromotionRepository,
        private readonly promotionProductService: PromotionProductService,
        private readonly promotionItemService: PromotionItemService
    ) { }

    async findById(id: string): Promise<Promotion | undefined> {
        const options = { relations: relationshipNames };
        const founded = await this.promotionRepository.findOne(id, options);
        if (founded.type === PromotionType.SHORTTERM) {
            const productList = await this.promotionProductService.findManyByfields({ where: { promotion: id } });
            founded.promotionProduct = productList;
        } else {
            const promotionItems = await this.promotionItemService.findManyByfields({ where: { promotion: id } });
            founded.promotionItems = promotionItems;
        }

        return founded;
    }

    async findByfields(options: FindOneOptions<Promotion>): Promise<Promotion | undefined> {
        // options.cache = 36000000
        return await this.promotionRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<Promotion>): Promise<[Promotion[], number]> {
        options.relations = relationshipNames;
        // options.cache = 36000000
        return await this.promotionRepository.findAndCount(options);
    }

    async save(promotion: Promotion): Promise<Promotion | undefined> {
        const saved = await this.promotionRepository.save(promotion);
        if (promotion.id) {
            if (saved.type === PromotionType.SHORTTERM) {

                if (Array.isArray(promotion.promotionProduct)) {
                    const productList = await this.promotionProductService.findManyByfields({ where: { promotion: saved.id } });
                    await this.promotionProductService.deleteMany(productList);
                    const promoteProduct = promotion.promotionProduct.map(item => ({ ...item, promotion: saved }));
                    await this.promotionProductService.saveList(promoteProduct);
                }
            } else {
                if (Array.isArray(promotion.promotionItems)) {
                    const promotionItemList = await this.promotionItemService.findManyByfields({ where: { promotion: saved.id } });
                    await this.promotionItemService.deleteMany(promotionItemList);
                    const promoteItems = promotion.promotionItems.map(item => ({ ...item, promotion: saved }));
                    await this.promotionItemService.saveList(promoteItems);
                }
            }
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
