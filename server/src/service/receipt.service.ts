import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Receipt from '../domain/receipt.entity';
import { ReceiptRepository } from '../repository/receipt.repository';

const relationshipNames = [];

@Injectable()
export class ReceiptService {
  logger = new Logger('ReceiptService');

  constructor(@InjectRepository(ReceiptRepository) private receiptRepository: ReceiptRepository) {}

  async findById(id: string): Promise<Receipt | undefined> {
    const options = { relations: relationshipNames };
    return await this.receiptRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Receipt>): Promise<Receipt | undefined> {
    return await this.receiptRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Receipt>): Promise<[Receipt[], number]> {
    options.relations = relationshipNames;
    return await this.receiptRepository.findAndCount(options);
  }

  async save(receipt: Receipt): Promise<Receipt | undefined> {
    return await this.receiptRepository.save(receipt);
  }

  async update(receipt: Receipt): Promise<Receipt | undefined> {
    return await this.save(receipt);
  }

  async delete(receipt: Receipt): Promise<Receipt | undefined> {
    return await this.receiptRepository.remove(receipt);
  }
}
