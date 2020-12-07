import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblAttribute from '../domain/tbl-attribute.entity';
import { TblAttributeRepository } from '../repository/tbl-attribute.repository';

const relationshipNames = [];
relationshipNames.push('product');

@Injectable()
export class TblAttributeService {
  logger = new Logger('TblAttributeService');

  constructor(@InjectRepository(TblAttributeRepository) private tblAttributeRepository: TblAttributeRepository) {}

  async findById(id: string): Promise<TblAttribute | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblAttributeRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblAttribute>): Promise<TblAttribute | undefined> {
    return await this.tblAttributeRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblAttribute>): Promise<[TblAttribute[], number]> {
    options.relations = relationshipNames;
    return await this.tblAttributeRepository.findAndCount(options);
  }

  async save(tblAttribute: TblAttribute): Promise<TblAttribute | undefined> {
    return await this.tblAttributeRepository.save(tblAttribute);
  }

  async update(tblAttribute: TblAttribute): Promise<TblAttribute | undefined> {
    return await this.save(tblAttribute);
  }

  async delete(tblAttribute: TblAttribute): Promise<TblAttribute | undefined> {
    return await this.tblAttributeRepository.remove(tblAttribute);
  }
}
