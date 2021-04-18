import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import PromotionProduct from '../domain/promotion-product.entity';
import { PromotionProductRepository } from '../repository/promotion-product.repository';

const relationshipNames = [];
relationshipNames.push('product');
relationshipNames.push('promotion');

@Injectable()
export class PromotionProductService {
    logger = new Logger('PromotionProductService');

    constructor(@InjectRepository(PromotionProductRepository) private promotionProductRepository: PromotionProductRepository) {}

    async findById(id: string): Promise<PromotionProduct | undefined> {
        const options = { relations: relationshipNames };
        return await this.promotionProductRepository.findOne(id, options);
    }

    async findManyByManyId(ids: []): Promise<[PromotionProduct[], number]> {
        if (ids.length > 0) {
            const result = await this.promotionProductRepository
                .createQueryBuilder('PromotionProduct')
                .leftJoinAndSelect('PromotionProduct.product', 'product')
                .where('PromotionProduct.id IN (:authors)', { authors: ids })
                .orderBy('PromotionProduct.createdDate')
                .getManyAndCount();
            return result;
        }
        return [[], 0];
    }

    async findByfields(options: FindOneOptions<PromotionProduct>): Promise<PromotionProduct | undefined> {
        return await this.promotionProductRepository.findOne(options);
    }

    async findManyByfields(options: FindOneOptions<PromotionProduct>): Promise<PromotionProduct[] | undefined> {
        options = { ...options, relations: relationshipNames };
        return await this.promotionProductRepository.find(options);
    }

    async findAndCount(options: FindManyOptions<PromotionProduct>): Promise<[PromotionProduct[], number]> {
        options.relations = relationshipNames;
        return await this.promotionProductRepository.findAndCount(options);
    }

    async save(promotionProduct: PromotionProduct): Promise<PromotionProduct | undefined> {
        return await this.promotionProductRepository.save(promotionProduct);
    }

    async saveList(promotionProducts: PromotionProduct[]): Promise<PromotionProduct[] | undefined> {
        return await this.promotionProductRepository.save(promotionProducts);
    }

    async update(promotionProduct: PromotionProduct): Promise<PromotionProduct | undefined> {
        return await this.save(promotionProduct);
    }

    async delete(promotionProduct: PromotionProduct): Promise<PromotionProduct | undefined> {
        return await this.promotionProductRepository.remove(promotionProduct);
    }
    async deleteMany(promotionProducts: PromotionProduct[]): Promise<PromotionProduct[] | undefined> {
        return await this.promotionProductRepository.remove(promotionProducts);
    }
}
