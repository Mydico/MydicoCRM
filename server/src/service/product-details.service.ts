import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import ProductDetails from '../domain/product-details.entity';
import { ProductDetailsRepository } from '../repository/product-details.repository';

const relationshipNames = [];
relationshipNames.push('product');

@Injectable()
export class ProductDetailsService {
  logger = new Logger('ProductDetailsService');

  constructor(@InjectRepository(ProductDetailsRepository) private productDetailsRepository: ProductDetailsRepository) {}

  async findById(id: string): Promise<ProductDetails | undefined> {
    const options = { relations: relationshipNames };
    return await this.productDetailsRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<ProductDetails>): Promise<ProductDetails | undefined> {
    return await this.productDetailsRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<ProductDetails>): Promise<[ProductDetails[], number]> {
    options.relations = relationshipNames;
    return await this.productDetailsRepository.findAndCount(options);
  }

  async save(productDetails: ProductDetails): Promise<ProductDetails | undefined> {
    return await this.productDetailsRepository.save(productDetails);
  }

  async update(productDetails: ProductDetails): Promise<ProductDetails | undefined> {
    return await this.save(productDetails);
  }

  async delete(productDetails: ProductDetails): Promise<ProductDetails | undefined> {
    return await this.productDetailsRepository.remove(productDetails);
  }
}
