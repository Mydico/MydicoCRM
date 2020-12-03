import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblPromotionItem from '../domain/tbl-promotion-item.entity';
import { TblPromotionItemRepository } from '../repository/tbl-promotion-item.repository';

const relationshipNames = [];

@Injectable()
export class TblPromotionItemService {
  logger = new Logger('TblPromotionItemService');

  constructor(@InjectRepository(TblPromotionItemRepository) private tblPromotionItemRepository: TblPromotionItemRepository) {}

  async findById(id: string): Promise<TblPromotionItem | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblPromotionItemRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblPromotionItem>): Promise<TblPromotionItem | undefined> {
    return await this.tblPromotionItemRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblPromotionItem>): Promise<[TblPromotionItem[], number]> {
    options.relations = relationshipNames;
    return await this.tblPromotionItemRepository.findAndCount(options);
  }

  async save(tblPromotionItem: TblPromotionItem): Promise<TblPromotionItem | undefined> {
    return await this.tblPromotionItemRepository.save(tblPromotionItem);
  }

  async update(tblPromotionItem: TblPromotionItem): Promise<TblPromotionItem | undefined> {
    return await this.save(tblPromotionItem);
  }

  async delete(tblPromotionItem: TblPromotionItem): Promise<TblPromotionItem | undefined> {
    return await this.tblPromotionItemRepository.remove(tblPromotionItem);
  }
}
