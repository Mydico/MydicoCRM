import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import Customer from '../domain/customer.entity';
import { CustomerRepository } from '../repository/customer.repository';
import { increment_alphanumeric_str, decrement_alphanumeric_str } from './utils/normalizeString';

const relationshipNames = [];
relationshipNames.push('city');
relationshipNames.push('district');
relationshipNames.push('ward');
relationshipNames.push('fanpage');
relationshipNames.push('skin');
relationshipNames.push('category');
relationshipNames.push('status');
relationshipNames.push('type');
relationshipNames.push('request');
relationshipNames.push('department');
relationshipNames.push('users');

@Injectable()
export class CustomerService {
    logger = new Logger('CustomerService');

    constructor(@InjectRepository(CustomerRepository) private customerRepository: CustomerRepository) {}

    async findById(id: string): Promise<Customer | undefined> {
        const options = { relations: relationshipNames };
        return await this.customerRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<Customer>): Promise<Customer | undefined> {
        return await this.customerRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<Customer>): Promise<[Customer[], number]> {
        options.relations = relationshipNames;
        return await this.customerRepository.findAndCount(options);
    }

    async save(customer: Customer): Promise<Customer | undefined> {
        const foundedCustomer = await this.customerRepository.find({
            code: Like(`%${customer.code}%`),
        });
        if (foundedCustomer.length > 0) {
            const reg = new RegExp(customer.code + '\\d*$');
            const founded = [];
            foundedCustomer.forEach(item => {
                if (reg.test(item.code)) {
                    founded.push(item.code);
                }
            });
            if (founded.length > 0) {
                const res = increment_alphanumeric_str(founded[founded.length - 1]);
                customer.code = res;
            }
        }
        return await this.customerRepository.save(customer);
    }

    async update(customer: Customer): Promise<Customer | undefined> {
        return await this.customerRepository.save(customer);
    }

    async delete(customer: Customer): Promise<Customer | undefined> {
        return await this.customerRepository.remove(customer);
    }
}
