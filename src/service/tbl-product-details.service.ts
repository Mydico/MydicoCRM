import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblProductDetails from '../domain/tbl-product-details.entity';
import { TblProductDetailsRepository } from '../repository/tbl-product-details.repository';

const relationshipNames = [];
relationshipNames.push('product');

@Injectable()
export class TblProductDetailsService {
  logger = new Logger('TblProductDetailsService');

  constructor(@InjectRepository(TblProductDetailsRepository) private tblProductDetailsRepository: TblProductDetailsRepository) {}

  async findById(id: string): Promise<TblProductDetails | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblProductDetailsRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblProductDetails>): Promise<TblProductDetails | undefined> {
    return await this.tblProductDetailsRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblProductDetails>): Promise<[TblProductDetails[], number]> {
    options.relations = relationshipNames;
    return await this.tblProductDetailsRepository.findAndCount(options);
  }

  async save(tblProductDetails: TblProductDetails): Promise<TblProductDetails | undefined> {
    return await this.tblProductDetailsRepository.save(tblProductDetails);
  }

  async update(tblProductDetails: TblProductDetails): Promise<TblProductDetails | undefined> {
    return await this.save(tblProductDetails);
  }

  async delete(tblProductDetails: TblProductDetails): Promise<TblProductDetails | undefined> {
    return await this.tblProductDetailsRepository.remove(tblProductDetails);
  }
}
