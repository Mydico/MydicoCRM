import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import CustomerDebit from '../domain/customer-debit.entity';
import { CustomerDebitRepository } from '../repository/customer-debit.repository';

const relationshipNames = [];
relationshipNames.push('customer');
relationshipNames.push('customer.sale');

@Injectable()
export class CustomerDebitService {
    logger = new Logger('CustomerDebitService');

    constructor(@InjectRepository(CustomerDebitRepository) private customerDebitRepository: CustomerDebitRepository) {}

    async findById(id: string): Promise<CustomerDebit | undefined> {
        const options = { relations: relationshipNames };
        return await this.customerDebitRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<CustomerDebit>): Promise<CustomerDebit | undefined> {
        return await this.customerDebitRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<CustomerDebit>): Promise<[CustomerDebit[], number]> {
        options.relations = relationshipNames;
        return await this.customerDebitRepository.findAndCount(options);
    }

    async save(customerDebit: CustomerDebit): Promise<CustomerDebit | undefined> {
        return await this.customerDebitRepository.save(customerDebit);
    }

    async update(customerDebit: CustomerDebit): Promise<CustomerDebit | undefined> {
        return await this.save(customerDebit);
    }

    async delete(customerDebit: CustomerDebit): Promise<CustomerDebit | undefined> {
        return await this.customerDebitRepository.remove(customerDebit);
    }
}
