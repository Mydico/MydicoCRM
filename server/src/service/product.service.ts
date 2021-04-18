import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import Product from '../domain/product.entity';
import { ProductRepository } from '../repository/product.repository';
import { increment_alphanumeric_str } from './utils/normalizeString';

const relationshipNames = [];
relationshipNames.push('productGroup');
relationshipNames.push('productBrand');

@Injectable()
export class ProductService {
    logger = new Logger('ProductService');

    constructor(@InjectRepository(ProductRepository) private productRepository: ProductRepository) {}

    async findById(id: string): Promise<Product | undefined> {
        const options = { relations: relationshipNames };
        return await this.productRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<Product>): Promise<Product | undefined> {
        return await this.productRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<Product>): Promise<[Product[], number]> {
        options.relations = relationshipNames;
        return await this.productRepository.findAndCount(options);
    }

    async save(product: Product): Promise<Product | undefined> {
        const foundedCustomer = await this.productRepository.find({ code: Like(`%${product.code}%`) });
        if (foundedCustomer.length > 0) {
            foundedCustomer.sort((a, b) => a.createdDate.valueOf() - b.createdDate.valueOf());
            const res = increment_alphanumeric_str(foundedCustomer[foundedCustomer.length - 1].code);
            product.code = res;
        }
        return await this.productRepository.save(product);
    }

    async update(product: Product): Promise<Product | undefined> {
        return await this.save(product);
    }

    async delete(product: Product): Promise<Product | undefined> {
        return await this.productRepository.remove(product);
    }
}
