import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import PromotionCustomerLevel from '../domain/promotion-customer-level.entity';
import { PromotionCustomerLevelRepository } from '../repository/promotion-customer-level.repository';

const relationshipNames = [];

@Injectable()
export class PromotionCustomerLevelService {
    logger = new Logger('PromotionCustomerLevelService');

    constructor(
        @InjectRepository(PromotionCustomerLevelRepository) private promotionCustomerLevelRepository: PromotionCustomerLevelRepository
    ) {}

    async findById(id: string): Promise<PromotionCustomerLevel | undefined> {
        const options = { relations: relationshipNames };
        return await this.promotionCustomerLevelRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<PromotionCustomerLevel>): Promise<PromotionCustomerLevel | undefined> {
        return await this.promotionCustomerLevelRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<PromotionCustomerLevel>): Promise<[PromotionCustomerLevel[], number]> {
        options.relations = relationshipNames;
        return await this.promotionCustomerLevelRepository.findAndCount(options);
    }

    async save(promotionCustomerLevel: PromotionCustomerLevel): Promise<PromotionCustomerLevel | undefined> {
        return await this.promotionCustomerLevelRepository.save(promotionCustomerLevel);
    }

    async update(promotionCustomerLevel: PromotionCustomerLevel): Promise<PromotionCustomerLevel | undefined> {
        return await this.save(promotionCustomerLevel);
    }

    async delete(promotionCustomerLevel: PromotionCustomerLevel): Promise<PromotionCustomerLevel | undefined> {
        return await this.promotionCustomerLevelRepository.remove(promotionCustomerLevel);
    }
}
