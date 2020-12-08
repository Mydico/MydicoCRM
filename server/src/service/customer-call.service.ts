import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import CustomerCall from '../domain/customer-call.entity';
import { CustomerCallRepository } from '../repository/customer-call.repository';

const relationshipNames = [];

@Injectable()
export class CustomerCallService {
  logger = new Logger('CustomerCallService');

  constructor(@InjectRepository(CustomerCallRepository) private customerCallRepository: CustomerCallRepository) {}

  async findById(id: string): Promise<CustomerCall | undefined> {
    const options = { relations: relationshipNames };
    return await this.customerCallRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<CustomerCall>): Promise<CustomerCall | undefined> {
    return await this.customerCallRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<CustomerCall>): Promise<[CustomerCall[], number]> {
    options.relations = relationshipNames;
    return await this.customerCallRepository.findAndCount(options);
  }

  async save(customerCall: CustomerCall): Promise<CustomerCall | undefined> {
    return await this.customerCallRepository.save(customerCall);
  }

  async update(customerCall: CustomerCall): Promise<CustomerCall | undefined> {
    return await this.save(customerCall);
  }

  async delete(customerCall: CustomerCall): Promise<CustomerCall | undefined> {
    return await this.customerCallRepository.remove(customerCall);
  }
}
