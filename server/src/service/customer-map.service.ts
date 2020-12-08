import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import CustomerMap from '../domain/customer-map.entity';
import { CustomerMapRepository } from '../repository/customer-map.repository';

const relationshipNames = [];

@Injectable()
export class CustomerMapService {
  logger = new Logger('CustomerMapService');

  constructor(@InjectRepository(CustomerMapRepository) private customerMapRepository: CustomerMapRepository) {}

  async findById(id: string): Promise<CustomerMap | undefined> {
    const options = { relations: relationshipNames };
    return await this.customerMapRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<CustomerMap>): Promise<CustomerMap | undefined> {
    return await this.customerMapRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<CustomerMap>): Promise<[CustomerMap[], number]> {
    options.relations = relationshipNames;
    return await this.customerMapRepository.findAndCount(options);
  }

  async save(customerMap: CustomerMap): Promise<CustomerMap | undefined> {
    return await this.customerMapRepository.save(customerMap);
  }

  async update(customerMap: CustomerMap): Promise<CustomerMap | undefined> {
    return await this.save(customerMap);
  }

  async delete(customerMap: CustomerMap): Promise<CustomerMap | undefined> {
    return await this.customerMapRepository.remove(customerMap);
  }
}
