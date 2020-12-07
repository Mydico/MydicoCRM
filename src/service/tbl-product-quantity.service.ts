import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblProductQuantity from '../domain/tbl-product-quantity.entity';
import { TblProductQuantityRepository } from '../repository/tbl-product-quantity.repository';

const relationshipNames = [];
relationshipNames.push('store');
relationshipNames.push('detail');

@Injectable()
export class TblProductQuantityService {
  logger = new Logger('TblProductQuantityService');

  constructor(@InjectRepository(TblProductQuantityRepository) private tblProductQuantityRepository: TblProductQuantityRepository) {}

  async findById(id: string): Promise<TblProductQuantity | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblProductQuantityRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblProductQuantity>): Promise<TblProductQuantity | undefined> {
    return await this.tblProductQuantityRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblProductQuantity>): Promise<[TblProductQuantity[], number]> {
    options.relations = relationshipNames;
    return await this.tblProductQuantityRepository.findAndCount(options);
  }

  async save(tblProductQuantity: TblProductQuantity): Promise<TblProductQuantity | undefined> {
    return await this.tblProductQuantityRepository.save(tblProductQuantity);
  }

  async update(tblProductQuantity: TblProductQuantity): Promise<TblProductQuantity | undefined> {
    return await this.save(tblProductQuantity);
  }

  async delete(tblProductQuantity: TblProductQuantity): Promise<TblProductQuantity | undefined> {
    return await this.tblProductQuantityRepository.remove(tblProductQuantity);
  }
}
