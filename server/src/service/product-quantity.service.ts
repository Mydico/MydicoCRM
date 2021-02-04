import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import ProductQuantity from '../domain/product-quantity.entity';
import { ProductQuantityRepository } from '../repository/product-quantity.repository';
import { Request } from 'express';
import { PageRequest } from 'src/domain/base/pagination.entity';

const relationshipNames = [];
relationshipNames.push('store');
relationshipNames.push('product');

@Injectable()
export class ProductQuantityService {
  logger = new Logger('ProductQuantityService');

  constructor(@InjectRepository(ProductQuantityRepository) private productQuantityRepository: ProductQuantityRepository) {}

  async findById(id: string): Promise<ProductQuantity | undefined> {
    const options = { relations: relationshipNames };
    return await this.productQuantityRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<ProductQuantity>): Promise<ProductQuantity | undefined> {
    return await this.productQuantityRepository.findOne(options);
  }

  async findAndCount(pageRequest: PageRequest,req: Request): Promise<[ProductQuantity[], number]> {
    // options.relations = relationshipNames;
    return await this.productQuantityRepository.createQueryBuilder('ProductQuantity')
    .leftJoinAndSelect('ProductQuantity.product','product')
    .leftJoinAndSelect('product.productBrand','productBrand')
    .where('ProductQuantity.store = (:storeId)', { storeId: req.query.store })
    .orderBy('ProductQuantity.createdDate')
    .skip(pageRequest.page * pageRequest.size)
    .take(pageRequest.size)
    .getManyAndCount();
    // return await this.productQuantityRepository.findAndCount(options);
  }

  async save(productQuantity: ProductQuantity): Promise<ProductQuantity | undefined> {
    return await this.productQuantityRepository.save(productQuantity);
  }

  async update(productQuantity: ProductQuantity): Promise<ProductQuantity | undefined> {
    return await this.save(productQuantity);
  }

  async delete(productQuantity: ProductQuantity): Promise<ProductQuantity | undefined> {
    return await this.productQuantityRepository.remove(productQuantity);
  }
}
