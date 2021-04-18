import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import CustomerToken from '../domain/customer-token.entity';
import { CustomerTokenRepository } from '../repository/customer-token.repository';

const relationshipNames = [];

@Injectable()
export class CustomerTokenService {
    logger = new Logger('CustomerTokenService');

    constructor(@InjectRepository(CustomerTokenRepository) private customerTokenRepository: CustomerTokenRepository) {}

    async findById(id: string): Promise<CustomerToken | undefined> {
        const options = { relations: relationshipNames };
        return await this.customerTokenRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<CustomerToken>): Promise<CustomerToken | undefined> {
        return await this.customerTokenRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<CustomerToken>): Promise<[CustomerToken[], number]> {
        options.relations = relationshipNames;
        return await this.customerTokenRepository.findAndCount(options);
    }

    async save(customerToken: CustomerToken): Promise<CustomerToken | undefined> {
        return await this.customerTokenRepository.save(customerToken);
    }

    async update(customerToken: CustomerToken): Promise<CustomerToken | undefined> {
        return await this.save(customerToken);
    }

    async delete(customerToken: CustomerToken): Promise<CustomerToken | undefined> {
        return await this.customerTokenRepository.remove(customerToken);
    }
}
