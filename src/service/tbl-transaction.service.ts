import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblTransaction from '../domain/tbl-transaction.entity';
import { TblTransactionRepository } from '../repository/tbl-transaction.repository';

const relationshipNames = [];

@Injectable()
export class TblTransactionService {
  logger = new Logger('TblTransactionService');

  constructor(@InjectRepository(TblTransactionRepository) private tblTransactionRepository: TblTransactionRepository) {}

  async findById(id: string): Promise<TblTransaction | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblTransactionRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblTransaction>): Promise<TblTransaction | undefined> {
    return await this.tblTransactionRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblTransaction>): Promise<[TblTransaction[], number]> {
    options.relations = relationshipNames;
    return await this.tblTransactionRepository.findAndCount(options);
  }

  async save(tblTransaction: TblTransaction): Promise<TblTransaction | undefined> {
    return await this.tblTransactionRepository.save(tblTransaction);
  }

  async update(tblTransaction: TblTransaction): Promise<TblTransaction | undefined> {
    return await this.save(tblTransaction);
  }

  async delete(tblTransaction: TblTransaction): Promise<TblTransaction | undefined> {
    return await this.tblTransactionRepository.remove(tblTransaction);
  }
}
