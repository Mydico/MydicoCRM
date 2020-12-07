import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblCustomerTemp from '../domain/tbl-customer-temp.entity';
import { TblCustomerTempRepository } from '../repository/tbl-customer-temp.repository';

const relationshipNames = [];

@Injectable()
export class TblCustomerTempService {
  logger = new Logger('TblCustomerTempService');

  constructor(@InjectRepository(TblCustomerTempRepository) private tblCustomerTempRepository: TblCustomerTempRepository) {}

  async findById(id: string): Promise<TblCustomerTemp | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblCustomerTempRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblCustomerTemp>): Promise<TblCustomerTemp | undefined> {
    return await this.tblCustomerTempRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblCustomerTemp>): Promise<[TblCustomerTemp[], number]> {
    options.relations = relationshipNames;
    return await this.tblCustomerTempRepository.findAndCount(options);
  }

  async save(tblCustomerTemp: TblCustomerTemp): Promise<TblCustomerTemp | undefined> {
    return await this.tblCustomerTempRepository.save(tblCustomerTemp);
  }

  async update(tblCustomerTemp: TblCustomerTemp): Promise<TblCustomerTemp | undefined> {
    return await this.save(tblCustomerTemp);
  }

  async delete(tblCustomerTemp: TblCustomerTemp): Promise<TblCustomerTemp | undefined> {
    return await this.tblCustomerTempRepository.remove(tblCustomerTemp);
  }
}
