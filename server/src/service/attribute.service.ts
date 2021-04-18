import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Attribute from '../domain/attribute.entity';
import { AttributeRepository } from '../repository/attribute.repository';

const relationshipNames = [];
relationshipNames.push('product');

@Injectable()
export class AttributeService {
    logger = new Logger('AttributeService');

    constructor(@InjectRepository(AttributeRepository) private attributeRepository: AttributeRepository) {}

    async findById(id: string): Promise<Attribute | undefined> {
        const options = { relations: relationshipNames };
        return await this.attributeRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<Attribute>): Promise<Attribute | undefined> {
        return await this.attributeRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<Attribute>): Promise<[Attribute[], number]> {
        options.relations = relationshipNames;
        return await this.attributeRepository.findAndCount(options);
    }

    async save(attribute: Attribute): Promise<Attribute | undefined> {
        return await this.attributeRepository.save(attribute);
    }

    async update(attribute: Attribute): Promise<Attribute | undefined> {
        return await this.save(attribute);
    }

    async delete(attribute: Attribute): Promise<Attribute | undefined> {
        return await this.attributeRepository.remove(attribute);
    }
}
