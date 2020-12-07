import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblAttributeMap from '../domain/tbl-attribute-map.entity';
import { TblAttributeMapRepository } from '../repository/tbl-attribute-map.repository';

const relationshipNames = [];
relationshipNames.push('detail');
relationshipNames.push('value');

@Injectable()
export class TblAttributeMapService {
  logger = new Logger('TblAttributeMapService');

  constructor(@InjectRepository(TblAttributeMapRepository) private tblAttributeMapRepository: TblAttributeMapRepository) {}

  async findById(id: string): Promise<TblAttributeMap | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblAttributeMapRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblAttributeMap>): Promise<TblAttributeMap | undefined> {
    return await this.tblAttributeMapRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblAttributeMap>): Promise<[TblAttributeMap[], number]> {
    options.relations = relationshipNames;
    return await this.tblAttributeMapRepository.findAndCount(options);
  }

  async save(tblAttributeMap: TblAttributeMap): Promise<TblAttributeMap | undefined> {
    return await this.tblAttributeMapRepository.save(tblAttributeMap);
  }

  async update(tblAttributeMap: TblAttributeMap): Promise<TblAttributeMap | undefined> {
    return await this.save(tblAttributeMap);
  }

  async delete(tblAttributeMap: TblAttributeMap): Promise<TblAttributeMap | undefined> {
    return await this.tblAttributeMapRepository.remove(tblAttributeMap);
  }
}
