import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import CustomerSkin from '../domain/customer-skin.entity';
import { CustomerSkinRepository } from '../repository/customer-skin.repository';

const relationshipNames = [];

@Injectable()
export class CustomerSkinService {
    logger = new Logger('CustomerSkinService');

    constructor(@InjectRepository(CustomerSkinRepository) private customerSkinRepository: CustomerSkinRepository) {}

    async findById(id: string): Promise<CustomerSkin | undefined> {
        const options = { relations: relationshipNames };
        return await this.customerSkinRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<CustomerSkin>): Promise<CustomerSkin | undefined> {
        return await this.customerSkinRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<CustomerSkin>): Promise<[CustomerSkin[], number]> {
        options.relations = relationshipNames;
        return await this.customerSkinRepository.findAndCount(options);
    }

    async save(customerSkin: CustomerSkin): Promise<CustomerSkin | undefined> {
        return await this.customerSkinRepository.save(customerSkin);
    }

    async update(customerSkin: CustomerSkin): Promise<CustomerSkin | undefined> {
        return await this.save(customerSkin);
    }

    async delete(customerSkin: CustomerSkin): Promise<CustomerSkin | undefined> {
        return await this.customerSkinRepository.remove(customerSkin);
    }
}
