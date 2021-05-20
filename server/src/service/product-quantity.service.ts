import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
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

  constructor(
    @InjectRepository(ProductQuantityRepository) private productQuantityRepository: ProductQuantityRepository,
  ) {}

  async findById(id: string): Promise<ProductQuantity | undefined> {
    const options = { relations: relationshipNames };
    return await this.productQuantityRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<ProductQuantity>): Promise<ProductQuantity[]> {
    options.relations = relationshipNames;
    return await this.productQuantityRepository.find(options);
  }

  async findAndCount(options: FindManyOptions<ProductQuantity>): Promise<[ProductQuantity[], number]> {
    options.relations = relationshipNames;
    return await this.productQuantityRepository.findAndCount(options);
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
