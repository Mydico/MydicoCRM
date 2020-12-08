import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Promotion from '../domain/promotion.entity';
import { PromotionRepository } from '../repository/promotion.repository';

const relationshipNames = [];

@Injectable()
export class PromotionService {
  logger = new Logger('PromotionService');

  constructor(@InjectRepository(PromotionRepository) private promotionRepository: PromotionRepository) {}

  async findById(id: string): Promise<Promotion | undefined> {
    const options = { relations: relationshipNames };
    return await this.promotionRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Promotion>): Promise<Promotion | undefined> {
    return await this.promotionRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Promotion>): Promise<[Promotion[], number]> {
    options.relations = relationshipNames;
    return await this.promotionRepository.findAndCount(options);
  }

  async save(promotion: Promotion): Promise<Promotion | undefined> {
    return await this.promotionRepository.save(promotion);
  }

  async update(promotion: Promotion): Promise<Promotion | undefined> {
    return await this.save(promotion);
  }

  async delete(promotion: Promotion): Promise<Promotion | undefined> {
    return await this.promotionRepository.remove(promotion);
  }
}
