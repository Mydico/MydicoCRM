import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import CustomerRequest from '../domain/customer-request.entity';
import { CustomerRequestRepository } from '../repository/customer-request.repository';

const relationshipNames = [];
relationshipNames.push('product');
relationshipNames.push('type');
relationshipNames.push('fanpage');

@Injectable()
export class CustomerRequestService {
    logger = new Logger('CustomerRequestService');

    constructor(@InjectRepository(CustomerRequestRepository) private customerRequestRepository: CustomerRequestRepository) {}

    async findById(id: string): Promise<CustomerRequest | undefined> {
        const options = { relations: relationshipNames };
        return await this.customerRequestRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<CustomerRequest>): Promise<CustomerRequest | undefined> {
        return await this.customerRequestRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<CustomerRequest>): Promise<[CustomerRequest[], number]> {
        options.relations = relationshipNames;
        return await this.customerRequestRepository.findAndCount(options);
    }

    async save(customerRequest: CustomerRequest): Promise<CustomerRequest | undefined> {
        return await this.customerRequestRepository.save(customerRequest);
    }

    async update(customerRequest: CustomerRequest): Promise<CustomerRequest | undefined> {
        return await this.save(customerRequest);
    }

    async delete(customerRequest: CustomerRequest): Promise<CustomerRequest | undefined> {
        return await this.customerRequestRepository.remove(customerRequest);
    }
}
