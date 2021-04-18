import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import CustomerAdvisory from '../domain/customer-advisory.entity';
import { CustomerAdvisoryRepository } from '../repository/customer-advisory.repository';

const relationshipNames = [];

@Injectable()
export class CustomerAdvisoryService {
    logger = new Logger('CustomerAdvisoryService');

    constructor(@InjectRepository(CustomerAdvisoryRepository) private customerAdvisoryRepository: CustomerAdvisoryRepository) {}

    async findById(id: string): Promise<CustomerAdvisory | undefined> {
        const options = { relations: relationshipNames };
        return await this.customerAdvisoryRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<CustomerAdvisory>): Promise<CustomerAdvisory | undefined> {
        return await this.customerAdvisoryRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<CustomerAdvisory>): Promise<[CustomerAdvisory[], number]> {
        options.relations = relationshipNames;
        return await this.customerAdvisoryRepository.findAndCount(options);
    }

    async save(customerAdvisory: CustomerAdvisory): Promise<CustomerAdvisory | undefined> {
        return await this.customerAdvisoryRepository.save(customerAdvisory);
    }

    async update(customerAdvisory: CustomerAdvisory): Promise<CustomerAdvisory | undefined> {
        return await this.save(customerAdvisory);
    }

    async delete(customerAdvisory: CustomerAdvisory): Promise<CustomerAdvisory | undefined> {
        return await this.customerAdvisoryRepository.remove(customerAdvisory);
    }
}
