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

  async findByfields(options: FindOneOptions<ProductQuantity>): Promise<ProductQuantity[]> {
    options.relations =  relationshipNames;
    return await this.productQuantityRepository.find(options);
  }

  async findAndCount(pageRequest: PageRequest, req: Request): Promise<[ProductQuantity[], number]> {
    // options.relations = relationshipNames;
    let queryString = '';
    Object.keys(req.query).forEach((item, index) => {
      if (item !== 'page' && item !== 'size' && item !== 'sort') {
        queryString += `ProductQuantity.${item} like '%${req.query[item]}%' ${Object.keys(req.query).length - 1 === index ? '' : 'OR '}`;
      }
    });
    return await this.productQuantityRepository
      .createQueryBuilder('ProductQuantity')
      .leftJoinAndSelect('ProductQuantity.product', 'product')
      .leftJoinAndSelect('ProductQuantity.store', 'store')
      .leftJoinAndSelect('product.productBrand', 'productBrand')
      .where(queryString)
      .orderBy('ProductQuantity.createdDate', 'DESC')
      .skip(pageRequest.page * pageRequest.size)
      .take(pageRequest.size)
      .getManyAndCount();
    // return await this.productQuantityRepository.findAndCount(options);
  }

  async save(productQuantity: ProductQuantity): Promise<ProductQuantity | undefined> {
    return await this.productQuantityRepository.save(productQuantity);
  }

  async saveMany(productQuantities: ProductQuantity[]): Promise<ProductQuantity[] | undefined> {
    return await this.productQuantityRepository.save(productQuantities);
  }

  async update(productQuantity: ProductQuantity): Promise<ProductQuantity | undefined> {
    return await this.save(productQuantity);
  }

  async delete(productQuantity: ProductQuantity): Promise<ProductQuantity | undefined> {
    return await this.productQuantityRepository.remove(productQuantity);
  }
}
