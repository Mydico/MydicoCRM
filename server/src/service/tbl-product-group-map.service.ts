import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblProductGroupMap from '../domain/tbl-product-group-map.entity';
import { TblProductGroupMapRepository } from '../repository/tbl-product-group-map.repository';

const relationshipNames = [];

@Injectable()
export class TblProductGroupMapService {
  logger = new Logger('TblProductGroupMapService');

  constructor(@InjectRepository(TblProductGroupMapRepository) private tblProductGroupMapRepository: TblProductGroupMapRepository) {}

  async findById(id: string): Promise<TblProductGroupMap | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblProductGroupMapRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblProductGroupMap>): Promise<TblProductGroupMap | undefined> {
    return await this.tblProductGroupMapRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblProductGroupMap>): Promise<[TblProductGroupMap[], number]> {
    options.relations = relationshipNames;
    return await this.tblProductGroupMapRepository.findAndCount(options);
  }

  async save(tblProductGroupMap: TblProductGroupMap): Promise<TblProductGroupMap | undefined> {
    return await this.tblProductGroupMapRepository.save(tblProductGroupMap);
  }

  async update(tblProductGroupMap: TblProductGroupMap): Promise<TblProductGroupMap | undefined> {
    return await this.save(tblProductGroupMap);
  }

  async delete(tblProductGroupMap: TblProductGroupMap): Promise<TblProductGroupMap | undefined> {
    return await this.tblProductGroupMapRepository.remove(tblProductGroupMap);
  }
}
