import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import ProductGroupMap from '../domain/product-group-map.entity';
import { ProductGroupMapRepository } from '../repository/product-group-map.repository';

const relationshipNames = [];

@Injectable()
export class ProductGroupMapService {
  logger = new Logger('ProductGroupMapService');

  constructor(@InjectRepository(ProductGroupMapRepository) private productGroupMapRepository: ProductGroupMapRepository) {}

  async findById(id: string): Promise<ProductGroupMap | undefined> {
    const options = { relations: relationshipNames };
    return await this.productGroupMapRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<ProductGroupMap>): Promise<ProductGroupMap | undefined> {
    return await this.productGroupMapRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<ProductGroupMap>): Promise<[ProductGroupMap[], number]> {
    options.relations = relationshipNames;
    return await this.productGroupMapRepository.findAndCount(options);
  }

  async save(productGroupMap: ProductGroupMap): Promise<ProductGroupMap | undefined> {
    return await this.productGroupMapRepository.save(productGroupMap);
  }

  async update(productGroupMap: ProductGroupMap): Promise<ProductGroupMap | undefined> {
    return await this.save(productGroupMap);
  }

  async delete(productGroupMap: ProductGroupMap): Promise<ProductGroupMap | undefined> {
    return await this.productGroupMapRepository.remove(productGroupMap);
  }
}
