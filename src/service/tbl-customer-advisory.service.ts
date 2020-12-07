import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblCustomerAdvisory from '../domain/tbl-customer-advisory.entity';
import { TblCustomerAdvisoryRepository } from '../repository/tbl-customer-advisory.repository';

const relationshipNames = [];

@Injectable()
export class TblCustomerAdvisoryService {
  logger = new Logger('TblCustomerAdvisoryService');

  constructor(@InjectRepository(TblCustomerAdvisoryRepository) private tblCustomerAdvisoryRepository: TblCustomerAdvisoryRepository) {}

  async findById(id: string): Promise<TblCustomerAdvisory | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblCustomerAdvisoryRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblCustomerAdvisory>): Promise<TblCustomerAdvisory | undefined> {
    return await this.tblCustomerAdvisoryRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblCustomerAdvisory>): Promise<[TblCustomerAdvisory[], number]> {
    options.relations = relationshipNames;
    return await this.tblCustomerAdvisoryRepository.findAndCount(options);
  }

  async save(tblCustomerAdvisory: TblCustomerAdvisory): Promise<TblCustomerAdvisory | undefined> {
    return await this.tblCustomerAdvisoryRepository.save(tblCustomerAdvisory);
  }

  async update(tblCustomerAdvisory: TblCustomerAdvisory): Promise<TblCustomerAdvisory | undefined> {
    return await this.save(tblCustomerAdvisory);
  }

  async delete(tblCustomerAdvisory: TblCustomerAdvisory): Promise<TblCustomerAdvisory | undefined> {
    return await this.tblCustomerAdvisoryRepository.remove(tblCustomerAdvisory);
  }
}
