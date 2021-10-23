import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindManyOptions, FindOneOptions, Like } from 'typeorm';
import Product from '../domain/product.entity';
import { ProductRepository } from '../repository/product.repository';
import { increment_alphanumeric_str } from './utils/normalizeString';
import { ProductQuantityService } from './product-quantity.service';
import { Cache } from 'cache-manager';
import { convertArrayToObject, generateCacheKey } from './utils/helperFunc';
const relationshipNames = [];
relationshipNames.push('productGroup');
relationshipNames.push('productBrand');

@Injectable()
export class ProductService {
  logger = new Logger('ProductService');

  constructor(
    @InjectRepository(ProductRepository) private productRepository: ProductRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private productQuantity: ProductQuantityService
  ) {}

  // async clearCache() {
  //   const keys: string[] = await this.cacheManager.store.keys();
  //   keys.forEach((key) => {
  //     if (key.startsWith('GET_POSTS_CACHE_KEY')) {
  //       this.cacheManager.del(key);
  //     }
  //   })
  // }

  async findById(id: string): Promise<Product | undefined> {
    const relation = [...relationshipNames];
    relation.push('productGroup.productBrand');
    const options = { relations: relation };
    return await this.productRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Product>): Promise<Product | undefined> {
    // options.cache = 36000000
    return await this.productRepository.findOne(options);
  }

  async findMany(options: FindManyOptions<Product>, filter: {}): Promise<Product[]> {
    const cacheKeyBuilder = generateCacheKey([], null, null, filter, options, 'product');

    const queryBuilder = this.productRepository
      .createQueryBuilder('Product')
      .leftJoinAndSelect('Product.productBrand', 'productBrand')
      .leftJoinAndSelect('Product.productGroup', 'productGroup')
      .cache(cacheKeyBuilder, 604800)
      .where(` Product.status = 'ACTIVE'`)
      .orderBy(`Product.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take);

    if (filter['productGroup']) {
      queryBuilder.andWhere(`Product.productGroup = ${filter['productGroup']}`);
    }
    if (filter['productBrand']) {
      queryBuilder.andWhere(`Product.productBrand = ${filter['productBrand']}`);
    }
    delete filter['productBrand'];
    delete filter['productGroup'];
    let queryString = '';
    Object.keys(filter).forEach((item, index) => {
      queryString += `Product.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'OR '}`;
    });

    if (queryString.length > 0) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          sqb.where(queryString);
        })
      );
    }
    const result = await queryBuilder.getMany();
    return result;
  }

  async findAndCount(options: FindManyOptions<Product>, filter: {}): Promise<[Product[], number]> {
    const cacheKeyBuilder = generateCacheKey([], null, null, filter, options, 'product');
    let queryString = '';
    Object.keys(filter).forEach((item, index) => {
      queryString += `Product.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
    });
    const queryBuilder = this.productRepository
      .createQueryBuilder('Product')
      .leftJoinAndSelect('Product.productBrand', 'productBrand')
      .leftJoinAndSelect('Product.productGroup', 'productGroup')
      .cache(cacheKeyBuilder, 604800)
      .where(queryString)
      .orderBy(`Product.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take);
    const countcacheKeyBuilder = generateCacheKey([], null, null, filter, options, 'product_count');
    const count = this.productRepository
      .createQueryBuilder('Product')
      .where(queryString)
      .orderBy(`Product.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take)
      .cache(countcacheKeyBuilder);
    const result = await queryBuilder.getManyAndCount();
    result[1] = await count.getCount();
    return result;
  }

  async getNewProductCode(product: Product): Promise<Product | undefined> {
    const foundedCustomer = await this.productRepository.find({ code: Like(`%${product.code}%`) });
    if (foundedCustomer.length > 0) {
      foundedCustomer.sort((a, b) => a.createdDate.valueOf() - b.createdDate.valueOf());
      const res = increment_alphanumeric_str(foundedCustomer[foundedCustomer.length - 1].code);
      product.code = res;
    }
    return product;
  }

  async save(product: Product): Promise<Product | undefined> {
    await this.productRepository.removeCache(['product']);
    if (product.id) {
      const foundedProduct = await this.productRepository.findOne({
        code: product.code
      });
      let tempProduct = product;
      if (foundedProduct && foundedProduct.id !== product.id) {
        tempProduct = await this.getNewProductCode(product);
      }
      const result = await this.productRepository.save(tempProduct);
      return result;
    }
    const newProduct = await this.getNewProductCode(product);
    return await this.productRepository.save(newProduct);
  }

  async update(product: Product): Promise<Product | undefined> {
    await this.productRepository.removeCache(['product']);
    const arrProductInStore = await this.productQuantity.findByfields({
      where: {
        product
      }
    });
    const updatedStatus = arrProductInStore.map(item => ({ ...item, status: product.status, name: product.name }));
    await this.productQuantity.saveMany(updatedStatus);
    return await this.save(product);
  }

  async delete(product: Product): Promise<Product | undefined> {
    return await this.productRepository.remove(product);
  }
}
