import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblReceipt from '../domain/tbl-receipt.entity';
import { TblReceiptRepository } from '../repository/tbl-receipt.repository';

const relationshipNames = [];

@Injectable()
export class TblReceiptService {
  logger = new Logger('TblReceiptService');

  constructor(@InjectRepository(TblReceiptRepository) private tblReceiptRepository: TblReceiptRepository) {}

  async findById(id: string): Promise<TblReceipt | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblReceiptRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblReceipt>): Promise<TblReceipt | undefined> {
    return await this.tblReceiptRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblReceipt>): Promise<[TblReceipt[], number]> {
    options.relations = relationshipNames;
    return await this.tblReceiptRepository.findAndCount(options);
  }

  async save(tblReceipt: TblReceipt): Promise<TblReceipt | undefined> {
    return await this.tblReceiptRepository.save(tblReceipt);
  }

  async update(tblReceipt: TblReceipt): Promise<TblReceipt | undefined> {
    return await this.save(tblReceipt);
  }

  async delete(tblReceipt: TblReceipt): Promise<TblReceipt | undefined> {
    return await this.tblReceiptRepository.remove(tblReceipt);
  }
}
