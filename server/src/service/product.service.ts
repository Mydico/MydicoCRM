import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import Product from '../domain/product.entity';
import { ProductRepository } from '../repository/product.repository';
import { increment_alphanumeric_str } from './utils/normalizeString';
import { ProductQuantityService } from './product-quantity.service';
import { Cache } from 'cache-manager';
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

  async findAndCount(options: FindManyOptions<Product>): Promise<[Product[], number]> {
    // options.cache = 36000000
    options.relations = relationshipNames;
    return await this.productRepository.findAndCount(options);
  }

  async save(product: Product): Promise<Product | undefined> {
    if (!product.code) {
      const foundedCustomer = await this.productRepository.find({ code: Like(`%${product.code}%`) });
      if (foundedCustomer.length > 0) {
        foundedCustomer.sort((a, b) => a.createdDate.valueOf() - b.createdDate.valueOf());
        const res = increment_alphanumeric_str(foundedCustomer[foundedCustomer.length - 1].code);
        product.code = res;
      }
    }
    return await this.productRepository.save(product);
  }

  async update(product: Product): Promise<Product | undefined> {
    const arrProductInStore = await this.productQuantity.findByfields({
      where: {
        product: product
      }
    });
    const updatedStatus = arrProductInStore.map(item => ({ ...item, status: product.status }));
    await this.productQuantity.saveMany(updatedStatus)
    return await this.save(product);
  }

  async delete(product: Product): Promise<Product | undefined> {
    return await this.productRepository.remove(product);
  }
}
