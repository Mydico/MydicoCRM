import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import CustomerType from '../domain/customer-type.entity';
import { CustomerTypeRepository } from '../repository/customer-type.repository';
import { checkCodeContext } from './utils/normalizeString';

const relationshipNames = [];

@Injectable()
export class CustomerTypeService {
    logger = new Logger('CustomerTypeService');

    constructor(@InjectRepository(CustomerTypeRepository) private customerTypeRepository: CustomerTypeRepository) {}

    async findById(id: string): Promise<CustomerType | undefined> {
        const options = { relations: relationshipNames };
        return await this.customerTypeRepository.findOne(id, options);
    }

    async checkExist(customerType: CustomerType): Promise<any> {
        return await this.customerTypeRepository.query('SELECT EXISTS(SELECT 1 FROM customer_type WHERE code = ? );', [customerType.code]);
    }

    async findByfields(options: FindOneOptions<CustomerType>): Promise<CustomerType | undefined> {
        return await this.customerTypeRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<CustomerType>): Promise<[CustomerType[], number]> {
        options.relations = relationshipNames;
        return await this.customerTypeRepository.findAndCount(options);
    }

    async save(customerType: CustomerType): Promise<CustomerType | undefined> {
        let newDepartment = customerType
        if(!customerType.id) {
            const foundedDepartment = await this.customerTypeRepository.find({
                code: Like(`%${customerType.code}%`),
            });
            newDepartment = checkCodeContext(customerType, foundedDepartment);
        }
        return await this.customerTypeRepository.save(newDepartment);
    }

    async update(customerType: CustomerType): Promise<CustomerType | undefined> {
        return await this.save(customerType);
    }

    async delete(customerType: CustomerType): Promise<CustomerType | undefined> {
        return await this.customerTypeRepository.remove(customerType);
    }
}
