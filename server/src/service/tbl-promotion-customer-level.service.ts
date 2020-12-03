import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblPromotionCustomerLevel from '../domain/tbl-promotion-customer-level.entity';
import { TblPromotionCustomerLevelRepository } from '../repository/tbl-promotion-customer-level.repository';

const relationshipNames = [];

@Injectable()
export class TblPromotionCustomerLevelService {
  logger = new Logger('TblPromotionCustomerLevelService');

  constructor(
    @InjectRepository(TblPromotionCustomerLevelRepository) private tblPromotionCustomerLevelRepository: TblPromotionCustomerLevelRepository
  ) {}

  async findById(id: string): Promise<TblPromotionCustomerLevel | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblPromotionCustomerLevelRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblPromotionCustomerLevel>): Promise<TblPromotionCustomerLevel | undefined> {
    return await this.tblPromotionCustomerLevelRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblPromotionCustomerLevel>): Promise<[TblPromotionCustomerLevel[], number]> {
    options.relations = relationshipNames;
    return await this.tblPromotionCustomerLevelRepository.findAndCount(options);
  }

  async save(tblPromotionCustomerLevel: TblPromotionCustomerLevel): Promise<TblPromotionCustomerLevel | undefined> {
    return await this.tblPromotionCustomerLevelRepository.save(tblPromotionCustomerLevel);
  }

  async update(tblPromotionCustomerLevel: TblPromotionCustomerLevel): Promise<TblPromotionCustomerLevel | undefined> {
    return await this.save(tblPromotionCustomerLevel);
  }

  async delete(tblPromotionCustomerLevel: TblPromotionCustomerLevel): Promise<TblPromotionCustomerLevel | undefined> {
    return await this.tblPromotionCustomerLevelRepository.remove(tblPromotionCustomerLevel);
  }
}
