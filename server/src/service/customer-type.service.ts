import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import CustomerType from '../domain/customer-type.entity';
import { CustomerTypeRepository } from '../repository/customer-type.repository';

const relationshipNames = [];

@Injectable()
export class CustomerTypeService {
  logger = new Logger('CustomerTypeService');

  constructor(@InjectRepository(CustomerTypeRepository) private customerTypeRepository: CustomerTypeRepository) {}

  async findById(id: string): Promise<CustomerType | undefined> {
    const options = { relations: relationshipNames };
    return await this.customerTypeRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<CustomerType>): Promise<CustomerType | undefined> {
    return await this.customerTypeRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<CustomerType>): Promise<[CustomerType[], number]> {
    options.relations = relationshipNames;
    return await this.customerTypeRepository.findAndCount(options);
  }

  async save(customerType: CustomerType): Promise<CustomerType | undefined> {
    return await this.customerTypeRepository.save(customerType);
  }

  async update(customerType: CustomerType): Promise<CustomerType | undefined> {
    return await this.save(customerType);
  }

  async delete(customerType: CustomerType): Promise<CustomerType | undefined> {
    return await this.customerTypeRepository.remove(customerType);
  }
}
