import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import ProductBrand from '../domain/product-brand.entity';
import { ProductBrandRepository } from '../repository/product-brand.repository';

const relationshipNames = [];

@Injectable()
export class ProductBrandService {
    logger = new Logger('ProductBrandService');

    constructor(@InjectRepository(ProductBrandRepository) private productBrandRepository: ProductBrandRepository) {}

    async findById(id: string): Promise<ProductBrand | undefined> {
        const options = { relations: relationshipNames };
        return await this.productBrandRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<ProductBrand>): Promise<ProductBrand | undefined> {
        return await this.productBrandRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<ProductBrand>): Promise<[ProductBrand[], number]> {
        options.relations = relationshipNames;
        return await this.productBrandRepository.findAndCount(options);
    }

    async save(productBrand: ProductBrand): Promise<ProductBrand | undefined> {
        return await this.productBrandRepository.save(productBrand);
    }

    async update(productBrand: ProductBrand): Promise<ProductBrand | undefined> {
        return await this.save(productBrand);
    }

    async delete(productBrand: ProductBrand): Promise<ProductBrand | undefined> {
        return await this.productBrandRepository.remove(productBrand);
    }
}
