import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblProductGroup from '../domain/tbl-product-group.entity';
import { TblProductGroupRepository } from '../repository/tbl-product-group.repository';

const relationshipNames = [];

@Injectable()
export class TblProductGroupService {
  logger = new Logger('TblProductGroupService');

  constructor(@InjectRepository(TblProductGroupRepository) private tblProductGroupRepository: TblProductGroupRepository) {}

  async findById(id: string): Promise<TblProductGroup | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblProductGroupRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblProductGroup>): Promise<TblProductGroup | undefined> {
    return await this.tblProductGroupRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblProductGroup>): Promise<[TblProductGroup[], number]> {
    options.relations = relationshipNames;
    return await this.tblProductGroupRepository.findAndCount(options);
  }

  async save(tblProductGroup: TblProductGroup): Promise<TblProductGroup | undefined> {
    return await this.tblProductGroupRepository.save(tblProductGroup);
  }

  async update(tblProductGroup: TblProductGroup): Promise<TblProductGroup | undefined> {
    return await this.save(tblProductGroup);
  }

  async delete(tblProductGroup: TblProductGroup): Promise<TblProductGroup | undefined> {
    return await this.tblProductGroupRepository.remove(tblProductGroup);
  }
}
