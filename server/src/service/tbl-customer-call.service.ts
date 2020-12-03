import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblCustomerCall from '../domain/tbl-customer-call.entity';
import { TblCustomerCallRepository } from '../repository/tbl-customer-call.repository';

const relationshipNames = [];

@Injectable()
export class TblCustomerCallService {
  logger = new Logger('TblCustomerCallService');

  constructor(@InjectRepository(TblCustomerCallRepository) private tblCustomerCallRepository: TblCustomerCallRepository) {}

  async findById(id: string): Promise<TblCustomerCall | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblCustomerCallRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblCustomerCall>): Promise<TblCustomerCall | undefined> {
    return await this.tblCustomerCallRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblCustomerCall>): Promise<[TblCustomerCall[], number]> {
    options.relations = relationshipNames;
    return await this.tblCustomerCallRepository.findAndCount(options);
  }

  async save(tblCustomerCall: TblCustomerCall): Promise<TblCustomerCall | undefined> {
    return await this.tblCustomerCallRepository.save(tblCustomerCall);
  }

  async update(tblCustomerCall: TblCustomerCall): Promise<TblCustomerCall | undefined> {
    return await this.save(tblCustomerCall);
  }

  async delete(tblCustomerCall: TblCustomerCall): Promise<TblCustomerCall | undefined> {
    return await this.tblCustomerCallRepository.remove(tblCustomerCall);
  }
}
