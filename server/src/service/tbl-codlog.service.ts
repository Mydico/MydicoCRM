import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblCodlog from '../domain/tbl-codlog.entity';
import { TblCodlogRepository } from '../repository/tbl-codlog.repository';

const relationshipNames = [];

@Injectable()
export class TblCodlogService {
  logger = new Logger('TblCodlogService');

  constructor(@InjectRepository(TblCodlogRepository) private tblCodlogRepository: TblCodlogRepository) {}

  async findById(id: string): Promise<TblCodlog | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblCodlogRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblCodlog>): Promise<TblCodlog | undefined> {
    return await this.tblCodlogRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblCodlog>): Promise<[TblCodlog[], number]> {
    options.relations = relationshipNames;
    return await this.tblCodlogRepository.findAndCount(options);
  }

  async save(tblCodlog: TblCodlog): Promise<TblCodlog | undefined> {
    return await this.tblCodlogRepository.save(tblCodlog);
  }

  async update(tblCodlog: TblCodlog): Promise<TblCodlog | undefined> {
    return await this.save(tblCodlog);
  }

  async delete(tblCodlog: TblCodlog): Promise<TblCodlog | undefined> {
    return await this.tblCodlogRepository.remove(tblCodlog);
  }
}
