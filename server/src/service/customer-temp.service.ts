import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import CustomerTemp from '../domain/customer-temp.entity';
import { CustomerTempRepository } from '../repository/customer-temp.repository';

const relationshipNames = [];

@Injectable()
export class CustomerTempService {
    logger = new Logger('CustomerTempService');

    constructor(@InjectRepository(CustomerTempRepository) private customerTempRepository: CustomerTempRepository) {}

    async findById(id: string): Promise<CustomerTemp | undefined> {
        const options = { relations: relationshipNames };
        return await this.customerTempRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<CustomerTemp>): Promise<CustomerTemp | undefined> {
        return await this.customerTempRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<CustomerTemp>): Promise<[CustomerTemp[], number]> {
        options.relations = relationshipNames;
        return await this.customerTempRepository.findAndCount(options);
    }

    async save(customerTemp: CustomerTemp): Promise<CustomerTemp | undefined> {
        return await this.customerTempRepository.save(customerTemp);
    }

    async update(customerTemp: CustomerTemp): Promise<CustomerTemp | undefined> {
        return await this.save(customerTemp);
    }

    async delete(customerTemp: CustomerTemp): Promise<CustomerTemp | undefined> {
        return await this.customerTempRepository.remove(customerTemp);
    }
}
