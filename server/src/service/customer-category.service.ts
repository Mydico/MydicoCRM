import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import CustomerCategory from '../domain/customer-category.entity';
import { CustomerCategoryRepository } from '../repository/customer-category.repository';

const relationshipNames = [];

@Injectable()
export class CustomerCategoryService {
  logger = new Logger('CustomerCategoryService');

  constructor(@InjectRepository(CustomerCategoryRepository) private customerCategoryRepository: CustomerCategoryRepository) {}

  async findById(id: string): Promise<CustomerCategory | undefined> {
    const options = { relations: relationshipNames };
    return await this.customerCategoryRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<CustomerCategory>): Promise<CustomerCategory | undefined> {
    return await this.customerCategoryRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<CustomerCategory>): Promise<[CustomerCategory[], number]> {
    options.relations = relationshipNames;
    return await this.customerCategoryRepository.findAndCount(options);
  }

  async save(customerCategory: CustomerCategory): Promise<CustomerCategory | undefined> {
    return await this.customerCategoryRepository.save(customerCategory);
  }

  async update(customerCategory: CustomerCategory): Promise<CustomerCategory | undefined> {
    return await this.save(customerCategory);
  }

  async delete(customerCategory: CustomerCategory): Promise<CustomerCategory | undefined> {
    return await this.customerCategoryRepository.remove(customerCategory);
  }
}
