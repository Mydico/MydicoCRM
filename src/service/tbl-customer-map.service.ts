import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblCustomerMap from '../domain/tbl-customer-map.entity';
import { TblCustomerMapRepository } from '../repository/tbl-customer-map.repository';

const relationshipNames = [];

@Injectable()
export class TblCustomerMapService {
  logger = new Logger('TblCustomerMapService');

  constructor(@InjectRepository(TblCustomerMapRepository) private tblCustomerMapRepository: TblCustomerMapRepository) {}

  async findById(id: string): Promise<TblCustomerMap | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblCustomerMapRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblCustomerMap>): Promise<TblCustomerMap | undefined> {
    return await this.tblCustomerMapRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblCustomerMap>): Promise<[TblCustomerMap[], number]> {
    options.relations = relationshipNames;
    return await this.tblCustomerMapRepository.findAndCount(options);
  }

  async save(tblCustomerMap: TblCustomerMap): Promise<TblCustomerMap | undefined> {
    return await this.tblCustomerMapRepository.save(tblCustomerMap);
  }

  async update(tblCustomerMap: TblCustomerMap): Promise<TblCustomerMap | undefined> {
    return await this.save(tblCustomerMap);
  }

  async delete(tblCustomerMap: TblCustomerMap): Promise<TblCustomerMap | undefined> {
    return await this.tblCustomerMapRepository.remove(tblCustomerMap);
  }
}
