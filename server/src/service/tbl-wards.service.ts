import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblWards from '../domain/tbl-wards.entity';
import { TblWardsRepository } from '../repository/tbl-wards.repository';

const relationshipNames = [];
relationshipNames.push('district');

@Injectable()
export class TblWardsService {
  logger = new Logger('TblWardsService');

  constructor(@InjectRepository(TblWardsRepository) private tblWardsRepository: TblWardsRepository) {}

  async findById(id: string): Promise<TblWards | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblWardsRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblWards>): Promise<TblWards | undefined> {
    return await this.tblWardsRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblWards>): Promise<[TblWards[], number]> {
    options.relations = relationshipNames;
    return await this.tblWardsRepository.findAndCount(options);
  }

  async save(tblWards: TblWards): Promise<TblWards | undefined> {
    return await this.tblWardsRepository.save(tblWards);
  }

  async update(tblWards: TblWards): Promise<TblWards | undefined> {
    return await this.save(tblWards);
  }

  async delete(tblWards: TblWards): Promise<TblWards | undefined> {
    return await this.tblWardsRepository.remove(tblWards);
  }
}
