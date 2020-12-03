import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblAttributeValue from '../domain/tbl-attribute-value.entity';
import { TblAttributeValueRepository } from '../repository/tbl-attribute-value.repository';

const relationshipNames = [];
relationshipNames.push('attribute');

@Injectable()
export class TblAttributeValueService {
  logger = new Logger('TblAttributeValueService');

  constructor(@InjectRepository(TblAttributeValueRepository) private tblAttributeValueRepository: TblAttributeValueRepository) {}

  async findById(id: string): Promise<TblAttributeValue | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblAttributeValueRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblAttributeValue>): Promise<TblAttributeValue | undefined> {
    return await this.tblAttributeValueRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblAttributeValue>): Promise<[TblAttributeValue[], number]> {
    options.relations = relationshipNames;
    return await this.tblAttributeValueRepository.findAndCount(options);
  }

  async save(tblAttributeValue: TblAttributeValue): Promise<TblAttributeValue | undefined> {
    return await this.tblAttributeValueRepository.save(tblAttributeValue);
  }

  async update(tblAttributeValue: TblAttributeValue): Promise<TblAttributeValue | undefined> {
    return await this.save(tblAttributeValue);
  }

  async delete(tblAttributeValue: TblAttributeValue): Promise<TblAttributeValue | undefined> {
    return await this.tblAttributeValueRepository.remove(tblAttributeValue);
  }
}
