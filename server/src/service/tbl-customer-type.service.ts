import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblCustomerType from '../domain/tbl-customer-type.entity';
import { TblCustomerTypeRepository } from '../repository/tbl-customer-type.repository';

const relationshipNames = [];

@Injectable()
export class TblCustomerTypeService {
  logger = new Logger('TblCustomerTypeService');

  constructor(@InjectRepository(TblCustomerTypeRepository) private tblCustomerTypeRepository: TblCustomerTypeRepository) {}

  async findById(id: string): Promise<TblCustomerType | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblCustomerTypeRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblCustomerType>): Promise<TblCustomerType | undefined> {
    return await this.tblCustomerTypeRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblCustomerType>): Promise<[TblCustomerType[], number]> {
    options.relations = relationshipNames;
    return await this.tblCustomerTypeRepository.findAndCount(options);
  }

  async save(tblCustomerType: TblCustomerType): Promise<TblCustomerType | undefined> {
    return await this.tblCustomerTypeRepository.save(tblCustomerType);
  }

  async update(tblCustomerType: TblCustomerType): Promise<TblCustomerType | undefined> {
    return await this.save(tblCustomerType);
  }

  async delete(tblCustomerType: TblCustomerType): Promise<TblCustomerType | undefined> {
    return await this.tblCustomerTypeRepository.remove(tblCustomerType);
  }
}
