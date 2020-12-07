import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblProduct from '../domain/tbl-product.entity';
import { TblProductRepository } from '../repository/tbl-product.repository';

const relationshipNames = [];

@Injectable()
export class TblProductService {
  logger = new Logger('TblProductService');

  constructor(@InjectRepository(TblProductRepository) private tblProductRepository: TblProductRepository) {}

  async findById(id: string): Promise<TblProduct | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblProductRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblProduct>): Promise<TblProduct | undefined> {
    return await this.tblProductRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblProduct>): Promise<[TblProduct[], number]> {
    options.relations = relationshipNames;
    return await this.tblProductRepository.findAndCount(options);
  }

  async save(tblProduct: TblProduct): Promise<TblProduct | undefined> {
    return await this.tblProductRepository.save(tblProduct);
  }

  async update(tblProduct: TblProduct): Promise<TblProduct | undefined> {
    return await this.save(tblProduct);
  }

  async delete(tblProduct: TblProduct): Promise<TblProduct | undefined> {
    return await this.tblProductRepository.remove(tblProduct);
  }
}
