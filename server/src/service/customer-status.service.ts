import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import CustomerStatus from '../domain/customer-status.entity';
import { CustomerStatusRepository } from '../repository/customer-status.repository';

const relationshipNames = [];

@Injectable()
export class CustomerStatusService {
  logger = new Logger('CustomerStatusService');

  constructor(@InjectRepository(CustomerStatusRepository) private customerStatusRepository: CustomerStatusRepository) {}

  async findById(id: string): Promise<CustomerStatus | undefined> {
    const options = { relations: relationshipNames };
    return await this.customerStatusRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<CustomerStatus>): Promise<CustomerStatus | undefined> {
    return await this.customerStatusRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<CustomerStatus>): Promise<[CustomerStatus[], number]> {
    options.relations = relationshipNames;
    return await this.customerStatusRepository.findAndCount(options);
  }

  async save(customerStatus: CustomerStatus): Promise<CustomerStatus | undefined> {
    return await this.customerStatusRepository.save(customerStatus);
  }

  async update(customerStatus: CustomerStatus): Promise<CustomerStatus | undefined> {
    return await this.save(customerStatus);
  }

  async delete(customerStatus: CustomerStatus): Promise<CustomerStatus | undefined> {
    return await this.customerStatusRepository.remove(customerStatus);
  }
}
