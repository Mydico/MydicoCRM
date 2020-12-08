import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import ProductGroup from '../domain/product-group.entity';
import { ProductGroupRepository } from '../repository/product-group.repository';

const relationshipNames = [];

@Injectable()
export class ProductGroupService {
  logger = new Logger('ProductGroupService');

  constructor(@InjectRepository(ProductGroupRepository) private productGroupRepository: ProductGroupRepository) {}

  async findById(id: string): Promise<ProductGroup | undefined> {
    const options = { relations: relationshipNames };
    return await this.productGroupRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<ProductGroup>): Promise<ProductGroup | undefined> {
    return await this.productGroupRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<ProductGroup>): Promise<[ProductGroup[], number]> {
    options.relations = relationshipNames;
    return await this.productGroupRepository.findAndCount(options);
  }

  async save(productGroup: ProductGroup): Promise<ProductGroup | undefined> {
    return await this.productGroupRepository.save(productGroup);
  }

  async update(productGroup: ProductGroup): Promise<ProductGroup | undefined> {
    return await this.save(productGroup);
  }

  async delete(productGroup: ProductGroup): Promise<ProductGroup | undefined> {
    return await this.productGroupRepository.remove(productGroup);
  }
}
