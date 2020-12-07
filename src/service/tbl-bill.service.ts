import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblBill from '../domain/tbl-bill.entity';
import { TblBillRepository } from '../repository/tbl-bill.repository';

const relationshipNames = [];

@Injectable()
export class TblBillService {
  logger = new Logger('TblBillService');

  constructor(@InjectRepository(TblBillRepository) private tblBillRepository: TblBillRepository) {}

  async findById(id: string): Promise<TblBill | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblBillRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblBill>): Promise<TblBill | undefined> {
    return await this.tblBillRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblBill>): Promise<[TblBill[], number]> {
    options.relations = relationshipNames;
    return await this.tblBillRepository.findAndCount(options);
  }

  async save(tblBill: TblBill): Promise<TblBill | undefined> {
    return await this.tblBillRepository.save(tblBill);
  }

  async update(tblBill: TblBill): Promise<TblBill | undefined> {
    return await this.save(tblBill);
  }

  async delete(tblBill: TblBill): Promise<TblBill | undefined> {
    return await this.tblBillRepository.remove(tblBill);
  }
}
