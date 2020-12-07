import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblCustomerCategory from '../domain/tbl-customer-category.entity';
import { TblCustomerCategoryRepository } from '../repository/tbl-customer-category.repository';

const relationshipNames = [];

@Injectable()
export class TblCustomerCategoryService {
  logger = new Logger('TblCustomerCategoryService');

  constructor(@InjectRepository(TblCustomerCategoryRepository) private tblCustomerCategoryRepository: TblCustomerCategoryRepository) {}

  async findById(id: string): Promise<TblCustomerCategory | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblCustomerCategoryRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblCustomerCategory>): Promise<TblCustomerCategory | undefined> {
    return await this.tblCustomerCategoryRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblCustomerCategory>): Promise<[TblCustomerCategory[], number]> {
    options.relations = relationshipNames;
    return await this.tblCustomerCategoryRepository.findAndCount(options);
  }

  async save(tblCustomerCategory: TblCustomerCategory): Promise<TblCustomerCategory | undefined> {
    return await this.tblCustomerCategoryRepository.save(tblCustomerCategory);
  }

  async update(tblCustomerCategory: TblCustomerCategory): Promise<TblCustomerCategory | undefined> {
    return await this.save(tblCustomerCategory);
  }

  async delete(tblCustomerCategory: TblCustomerCategory): Promise<TblCustomerCategory | undefined> {
    return await this.tblCustomerCategoryRepository.remove(tblCustomerCategory);
  }
}
