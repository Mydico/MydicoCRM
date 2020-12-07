import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblStoreInputDetails from '../domain/tbl-store-input-details.entity';
import { TblStoreInputDetailsRepository } from '../repository/tbl-store-input-details.repository';

const relationshipNames = [];
relationshipNames.push('nhapkho');
relationshipNames.push('chitiet');

@Injectable()
export class TblStoreInputDetailsService {
  logger = new Logger('TblStoreInputDetailsService');

  constructor(@InjectRepository(TblStoreInputDetailsRepository) private tblStoreInputDetailsRepository: TblStoreInputDetailsRepository) {}

  async findById(id: string): Promise<TblStoreInputDetails | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblStoreInputDetailsRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblStoreInputDetails>): Promise<TblStoreInputDetails | undefined> {
    return await this.tblStoreInputDetailsRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblStoreInputDetails>): Promise<[TblStoreInputDetails[], number]> {
    options.relations = relationshipNames;
    return await this.tblStoreInputDetailsRepository.findAndCount(options);
  }

  async save(tblStoreInputDetails: TblStoreInputDetails): Promise<TblStoreInputDetails | undefined> {
    return await this.tblStoreInputDetailsRepository.save(tblStoreInputDetails);
  }

  async update(tblStoreInputDetails: TblStoreInputDetails): Promise<TblStoreInputDetails | undefined> {
    return await this.save(tblStoreInputDetails);
  }

  async delete(tblStoreInputDetails: TblStoreInputDetails): Promise<TblStoreInputDetails | undefined> {
    return await this.tblStoreInputDetailsRepository.remove(tblStoreInputDetails);
  }
}
