import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblStoreInput from '../domain/tbl-store-input.entity';
import { TblStoreInputRepository } from '../repository/tbl-store-input.repository';

const relationshipNames = [];
relationshipNames.push('storeOutput');
relationshipNames.push('storeInput');

@Injectable()
export class TblStoreInputService {
  logger = new Logger('TblStoreInputService');

  constructor(@InjectRepository(TblStoreInputRepository) private tblStoreInputRepository: TblStoreInputRepository) {}

  async findById(id: string): Promise<TblStoreInput | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblStoreInputRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblStoreInput>): Promise<TblStoreInput | undefined> {
    return await this.tblStoreInputRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblStoreInput>): Promise<[TblStoreInput[], number]> {
    options.relations = relationshipNames;
    return await this.tblStoreInputRepository.findAndCount(options);
  }

  async save(tblStoreInput: TblStoreInput): Promise<TblStoreInput | undefined> {
    return await this.tblStoreInputRepository.save(tblStoreInput);
  }

  async update(tblStoreInput: TblStoreInput): Promise<TblStoreInput | undefined> {
    return await this.save(tblStoreInput);
  }

  async delete(tblStoreInput: TblStoreInput): Promise<TblStoreInput | undefined> {
    return await this.tblStoreInputRepository.remove(tblStoreInput);
  }
}
