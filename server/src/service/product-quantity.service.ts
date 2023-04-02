import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindManyOptions, FindOneOptions, In } from 'typeorm';
import ProductQuantity from '../domain/product-quantity.entity';
import { ProductQuantityRepository } from '../repository/product-quantity.repository';
import { queryBuilderFunc } from '../utils/helper/permission-normalization';
import { generateCacheKey } from './utils/helperFunc';

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
    const options = { relations: relationshipNames, cache : 10*60*1000 };
    return await this.productQuantityRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<ProductQuantity>): Promise<ProductQuantity[]> {
    options.relations = relationshipNames;
    options.cache = 10*60*1000
    return await this.productQuantityRepository.find(options);
  }

  // async filter(filter = {}, options: FindManyOptions<ProductQuantity>): Promise<[ProductQuantity[], number]> {
  //   let queryString = '';
  //   Object.keys(filter).forEach((item, index) => {
  //     // if(item === 'name'){
  //     //   // const listWord = filter[item].split(" ");
  //     //   // console.log(listWord);
  //     //   // listWord.forEach((element, index) => {
  //     //   //   queryString += `product.name like '%${element}%' ${listWord.length - 1 === index ? '' : 'OR '} `
  //     //   // });
  //     //   queryString += `MATCH(name) AGAINST ('${filter[item]}' IN BOOLEAN MODE)`
  //     // }
      
  //     if (item === 'store') return;
  //     if (item === 'status') return;
  //     queryString += `product.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'OR '} `;
  //   });
  //   const queryBuilder = this.productQuantityRepository
  //     .createQueryBuilder('ProductQuantity')
  //     .leftJoinAndSelect('ProductQuantity.product', 'product')
  //     .leftJoinAndSelect('product.productBrand', 'productBrand')
  //     .leftJoinAndSelect('product.productGroup', 'productGroup')
  //     .where(`ProductQuantity.store = ${filter['store']} AND ProductQuantity.status = 'ACTIVE'`)
  //     .orderBy(`ProductQuantity.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
  //     .skip(options.skip)
  //     .take(options.take);
  //   if (filter['store'] && queryString) {
  //     queryBuilder.andWhere(
  //       new Brackets(sqb => {
  //         sqb.where(queryString);
  //       })
  //     );
  //   }

  //   const result = await queryBuilder.getManyAndCount();
  //   return result;
  // }

  async countProduct(filter = {}, departmentVisible = [], options: FindManyOptions<ProductQuantity>): Promise<[ProductQuantity[], number]> {
    let queryString = '';
    if (departmentVisible.length > 0) {
      queryString += `ProductQuantity.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }

    Object.keys(filter).forEach((item, index) => {
      if (item === 'store') {
        queryString += ` AND ProductQuantity.store = ${filter[item]} `;
      } else if (item === 'code') {
        queryString += ` AND product.code like '%${filter[item]}%' `;
      } else if (item === 'volume') {
          queryString += ` AND product.volume like '${filter[item]}' `;
      } else {
        queryString += ` AND ProductQuantity.${item} like '%${filter[item]}%'`;
      }
    });
    const count = this.productQuantityRepository
    .createQueryBuilder('ProductQuantity')
    .leftJoinAndSelect('ProductQuantity.product', 'product')
    .select('sum(ProductQuantity.quantity)','count')
    .where(queryString)

    const result = await count.getRawOne();
    return result;
  }

  async filter(filter = {}, options: FindManyOptions<ProductQuantity>): Promise<[ProductQuantity[], number]> {
    let queryString = '';
    Object.keys(filter).forEach((item, index) => {
      if (item === 'store') return;
      if (item === 'status') return;
      queryString += `product.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'OR '} `;
    });
    const queryBuilder = this.productQuantityRepository
      .createQueryBuilder('ProductQuantity')
      .leftJoinAndSelect('ProductQuantity.product', 'product')
      .leftJoinAndSelect('product.productBrand', 'productBrand')
      .leftJoinAndSelect('product.productGroup', 'productGroup')
      .where(`ProductQuantity.store = ${filter['store']} AND ProductQuantity.status = 'ACTIVE'`)
      .cache(10*60*1000)
      // .andWhere(`MATCH(ProductQuantity.name) AGAINST ('${filter['name'] || ''}' IN NATURAL LANGUAGE MODE)`)
      .orderBy(`ProductQuantity.${Object.keys(options.order)[0] || 'ProductQuantity.createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take);
    if (filter['store'] && queryString) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          sqb.where(queryString);
        })
      );
    }

    const result = await queryBuilder.getManyAndCount();
    return result;
  }

  async findAndCount(filter = {}, departmentVisible = [], options: FindManyOptions<ProductQuantity>): Promise<[ProductQuantity[], number]> {
    let queryString = '1=1 ';
    Object.keys(filter).forEach((item, index) => {
      if (item === 'store') {
        queryString += ` AND ProductQuantity.store = ${filter[item]} `;
      } else if (item === 'code') {
        queryString += ` AND product.code like '%${filter[item]}%' `;
      } else if (item === 'volume') {
        queryString += ` AND product.volume = '${filter[item]}' `;
      } else {
        queryString += ` AND ProductQuantity.${item} like '%${filter[item]}%'`;
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
      .cache(10*60*1000)
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
