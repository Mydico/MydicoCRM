import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblCustomerRequest from '../domain/tbl-customer-request.entity';
import { TblCustomerRequestRepository } from '../repository/tbl-customer-request.repository';

const relationshipNames = [];
relationshipNames.push('product');
relationshipNames.push('type');
relationshipNames.push('fanpage');

@Injectable()
export class TblCustomerRequestService {
  logger = new Logger('TblCustomerRequestService');

  constructor(@InjectRepository(TblCustomerRequestRepository) private tblCustomerRequestRepository: TblCustomerRequestRepository) {}

  async findById(id: string): Promise<TblCustomerRequest | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblCustomerRequestRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblCustomerRequest>): Promise<TblCustomerRequest | undefined> {
    return await this.tblCustomerRequestRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblCustomerRequest>): Promise<[TblCustomerRequest[], number]> {
    options.relations = relationshipNames;
    return await this.tblCustomerRequestRepository.findAndCount(options);
  }

  async save(tblCustomerRequest: TblCustomerRequest): Promise<TblCustomerRequest | undefined> {
    return await this.tblCustomerRequestRepository.save(tblCustomerRequest);
  }

  async update(tblCustomerRequest: TblCustomerRequest): Promise<TblCustomerRequest | undefined> {
    return await this.save(tblCustomerRequest);
  }

  async delete(tblCustomerRequest: TblCustomerRequest): Promise<TblCustomerRequest | undefined> {
    return await this.tblCustomerRequestRepository.remove(tblCustomerRequest);
  }
}
