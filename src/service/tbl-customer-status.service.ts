import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblCustomerStatus from '../domain/tbl-customer-status.entity';
import { TblCustomerStatusRepository } from '../repository/tbl-customer-status.repository';

const relationshipNames = [];

@Injectable()
export class TblCustomerStatusService {
  logger = new Logger('TblCustomerStatusService');

  constructor(@InjectRepository(TblCustomerStatusRepository) private tblCustomerStatusRepository: TblCustomerStatusRepository) {}

  async findById(id: string): Promise<TblCustomerStatus | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblCustomerStatusRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblCustomerStatus>): Promise<TblCustomerStatus | undefined> {
    return await this.tblCustomerStatusRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblCustomerStatus>): Promise<[TblCustomerStatus[], number]> {
    options.relations = relationshipNames;
    return await this.tblCustomerStatusRepository.findAndCount(options);
  }

  async save(tblCustomerStatus: TblCustomerStatus): Promise<TblCustomerStatus | undefined> {
    return await this.tblCustomerStatusRepository.save(tblCustomerStatus);
  }

  async update(tblCustomerStatus: TblCustomerStatus): Promise<TblCustomerStatus | undefined> {
    return await this.save(tblCustomerStatus);
  }

  async delete(tblCustomerStatus: TblCustomerStatus): Promise<TblCustomerStatus | undefined> {
    return await this.tblCustomerStatusRepository.remove(tblCustomerStatus);
  }
}
