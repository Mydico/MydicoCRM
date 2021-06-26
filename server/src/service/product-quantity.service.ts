import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindManyOptions, FindOneOptions, In } from 'typeorm';
import ProductQuantity from '../domain/product-quantity.entity';
import { ProductQuantityRepository } from '../repository/product-quantity.repository';
import { Request, Response } from 'express';
import { PageRequest } from '../domain/base/pagination.entity';
import { User } from '../domain/user.entity';
import { DepartmentService } from './department.service';

const relationshipNames = [];
relationshipNames.push('store');
relationshipNames.push('product');
relationshipNames.push('product.productBrand');
relationshipNames.push('department');

@Injectable()
export class ProductQuantityService {
  logger = new Logger('ProductQuantityService');

  constructor(@InjectRepository(ProductQuantityRepository) private productQuantityRepository: ProductQuantityRepository) {}

  async findById(id: string): Promise<ProductQuantity | undefined> {
    const options = { relations: relationshipNames };
    return await this.productQuantityRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<ProductQuantity>): Promise<ProductQuantity[]> {
    options.relations = relationshipNames;
    return await this.productQuantityRepository.find(options);
  }

  async findAndCount(filter = {}, departmentVisible = [], options: FindManyOptions<ProductQuantity>): Promise<[ProductQuantity[], number]> {
    // options.relations = relationshipNames;
    // return await this.productQuantityRepository.findAndCount(options);
    let queryString = '1=1 ';
    Object.keys(filter).forEach((item, index) => {
      if (item === 'store') {
        queryString += `AND ProductQuantity.store = ${filter[item]} `;
      }else{
        queryString += ` AND product.${item} like '%${filter[item]}%'`;
      }
    });
    if (departmentVisible.length > 0) {
        queryString += ` AND ProductQuantity.department IN ${JSON.stringify(departmentVisible)
            .replace('[', '(')
            .replace(']', ')')}`;
    }
    const queryBuilder = this.productQuantityRepository
      .createQueryBuilder('ProductQuantity')
      .leftJoinAndSelect('ProductQuantity.store', 'store')
      .leftJoinAndSelect('ProductQuantity.product', 'product')
      .leftJoinAndSelect('product.productBrand', 'productBrand')
      .leftJoinAndSelect('ProductQuantity.department', 'department')
      .where(queryString)
      .orderBy(`ProductQuantity.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take);
    const result = await queryBuilder.getManyAndCount();
    return result;
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
