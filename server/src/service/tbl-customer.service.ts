import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblCustomer from '../domain/tbl-customer.entity';
import { TblCustomerRepository } from '../repository/tbl-customer.repository';

const relationshipNames = [];

@Injectable()
export class TblCustomerService {
  logger = new Logger('TblCustomerService');

  constructor(@InjectRepository(TblCustomerRepository) private tblCustomerRepository: TblCustomerRepository) {}

  async findById(id: string): Promise<TblCustomer | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblCustomerRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblCustomer>): Promise<TblCustomer | undefined> {
    return await this.tblCustomerRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblCustomer>): Promise<[TblCustomer[], number]> {
    options.relations = relationshipNames;
    return await this.tblCustomerRepository.findAndCount(options);
  }

  async save(tblCustomer: TblCustomer): Promise<TblCustomer | undefined> {
    return await this.tblCustomerRepository.save(tblCustomer);
  }

  async update(tblCustomer: TblCustomer): Promise<TblCustomer | undefined> {
    return await this.save(tblCustomer);
  }

  async delete(tblCustomer: TblCustomer): Promise<TblCustomer | undefined> {
    return await this.tblCustomerRepository.remove(tblCustomer);
  }
}
