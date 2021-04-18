import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import AttributeValue from '../domain/attribute-value.entity';
import { AttributeValueRepository } from '../repository/attribute-value.repository';

const relationshipNames = [];
relationshipNames.push('attribute');

@Injectable()
export class AttributeValueService {
    logger = new Logger('AttributeValueService');

    constructor(@InjectRepository(AttributeValueRepository) private attributeValueRepository: AttributeValueRepository) {}

    async findById(id: string): Promise<AttributeValue | undefined> {
        const options = { relations: relationshipNames };
        return await this.attributeValueRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<AttributeValue>): Promise<AttributeValue | undefined> {
        return await this.attributeValueRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<AttributeValue>): Promise<[AttributeValue[], number]> {
        options.relations = relationshipNames;
        return await this.attributeValueRepository.findAndCount(options);
    }

    async save(attributeValue: AttributeValue): Promise<AttributeValue | undefined> {
        return await this.attributeValueRepository.save(attributeValue);
    }

    async update(attributeValue: AttributeValue): Promise<AttributeValue | undefined> {
        return await this.save(attributeValue);
    }

    async delete(attributeValue: AttributeValue): Promise<AttributeValue | undefined> {
        return await this.attributeValueRepository.remove(attributeValue);
    }
}
