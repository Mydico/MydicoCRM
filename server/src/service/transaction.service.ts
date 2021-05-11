import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Transaction from '../domain/transaction.entity';
import { TransactionRepository } from '../repository/transaction.repository';

const relationshipNames = [];
relationshipNames.push('customer')
relationshipNames.push('customer.sale')
relationshipNames.push('bill')
relationshipNames.push('sale')
relationshipNames.push('receipt')
relationshipNames.push('order')
relationshipNames.push('storeInput')
@Injectable()
export class TransactionService {
  logger = new Logger('TransactionService');

  constructor(@InjectRepository(TransactionRepository) private transactionRepository: TransactionRepository) {}

  async findById(id: string): Promise<Transaction | undefined> {
    const options = { relations: relationshipNames };
    return await this.transactionRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Transaction>): Promise<Transaction | undefined> {
    return await this.transactionRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Transaction>): Promise<[Transaction[], number]> {
    options.relations = relationshipNames;
    return await this.transactionRepository.findAndCount(options);
  }

  async save(transaction: Transaction): Promise<Transaction | undefined> {
    return await this.transactionRepository.save(transaction);
  }

  async update(transaction: Transaction): Promise<Transaction | undefined> {
    return await this.save(transaction);
  }

  async delete(transaction: Transaction): Promise<Transaction | undefined> {
    return await this.transactionRepository.remove(transaction);
  }
}
