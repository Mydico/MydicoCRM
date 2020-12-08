import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import AttributeMap from '../domain/attribute-map.entity';
import { AttributeMapRepository } from '../repository/attribute-map.repository';

const relationshipNames = [];
relationshipNames.push('detail');
relationshipNames.push('value');

@Injectable()
export class AttributeMapService {
  logger = new Logger('AttributeMapService');

  constructor(@InjectRepository(AttributeMapRepository) private attributeMapRepository: AttributeMapRepository) {}

  async findById(id: string): Promise<AttributeMap | undefined> {
    const options = { relations: relationshipNames };
    return await this.attributeMapRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<AttributeMap>): Promise<AttributeMap | undefined> {
    return await this.attributeMapRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<AttributeMap>): Promise<[AttributeMap[], number]> {
    options.relations = relationshipNames;
    return await this.attributeMapRepository.findAndCount(options);
  }

  async save(attributeMap: AttributeMap): Promise<AttributeMap | undefined> {
    return await this.attributeMapRepository.save(attributeMap);
  }

  async update(attributeMap: AttributeMap): Promise<AttributeMap | undefined> {
    return await this.save(attributeMap);
  }

  async delete(attributeMap: AttributeMap): Promise<AttributeMap | undefined> {
    return await this.attributeMapRepository.remove(attributeMap);
  }
}
