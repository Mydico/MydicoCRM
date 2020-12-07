import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblStore from '../domain/tbl-store.entity';
import { TblStoreRepository } from '../repository/tbl-store.repository';

const relationshipNames = [];
relationshipNames.push('city');
relationshipNames.push('district');
relationshipNames.push('wards');

@Injectable()
export class TblStoreService {
  logger = new Logger('TblStoreService');

  constructor(@InjectRepository(TblStoreRepository) private tblStoreRepository: TblStoreRepository) {}

  async findById(id: string): Promise<TblStore | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblStoreRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblStore>): Promise<TblStore | undefined> {
    return await this.tblStoreRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblStore>): Promise<[TblStore[], number]> {
    options.relations = relationshipNames;
    return await this.tblStoreRepository.findAndCount(options);
  }

  async save(tblStore: TblStore): Promise<TblStore | undefined> {
    return await this.tblStoreRepository.save(tblStore);
  }

  async update(tblStore: TblStore): Promise<TblStore | undefined> {
    return await this.save(tblStore);
  }

  async delete(tblStore: TblStore): Promise<TblStore | undefined> {
    return await this.tblStoreRepository.remove(tblStore);
  }
}
