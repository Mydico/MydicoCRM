import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import PromotionItem from '../domain/promotion-item.entity';
import { PromotionItemRepository } from '../repository/promotion-item.repository';

const relationshipNames = [];
relationshipNames.push('productGroup');
relationshipNames.push('promotion');
@Injectable()
export class PromotionItemService {
    logger = new Logger('PromotionItemService');

    constructor(@InjectRepository(PromotionItemRepository) private promotionItemRepository: PromotionItemRepository) {}

    async findById(id: string): Promise<PromotionItem | undefined> {
        const options = { relations: relationshipNames };
        return await this.promotionItemRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<PromotionItem>): Promise<PromotionItem | undefined> {
        return await this.promotionItemRepository.findOne(options);
    }

    async findManyByfields(options: FindOneOptions<PromotionItem>): Promise<PromotionItem[] | undefined> {
        options = { ...options, relations: relationshipNames };
        return await this.promotionItemRepository.find(options);
    }

    async findAndCount(options: FindManyOptions<PromotionItem>): Promise<[PromotionItem[], number]> {
        options.relations = relationshipNames;
        return await this.promotionItemRepository.findAndCount(options);
    }

    async saveList(promotionItems: PromotionItem[]): Promise<PromotionItem[] | undefined> {
        return await this.promotionItemRepository.save(promotionItems);
    }

    async deleteMany(promotionItems: PromotionItem[]): Promise<PromotionItem[] | undefined> {
        return await this.promotionItemRepository.remove(promotionItems);
    }

    async save(promotionItem: PromotionItem): Promise<PromotionItem | undefined> {
        return await this.promotionItemRepository.save(promotionItem);
    }

    async update(promotionItem: PromotionItem): Promise<PromotionItem | undefined> {
        return await this.save(promotionItem);
    }

    async delete(promotionItem: PromotionItem): Promise<PromotionItem | undefined> {
        return await this.promotionItemRepository.remove(promotionItem);
    }
}
