import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Bill from '../domain/bill.entity';
import { BillRepository } from '../repository/bill.repository';

const relationshipNames = [];

@Injectable()
export class BillService {
  logger = new Logger('BillService');

  constructor(@InjectRepository(BillRepository) private billRepository: BillRepository) {}

  async findById(id: string): Promise<Bill | undefined> {
    const options = { relations: relationshipNames };
    return await this.billRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Bill>): Promise<Bill | undefined> {
    return await this.billRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Bill>): Promise<[Bill[], number]> {
    options.relations = relationshipNames;
    return await this.billRepository.findAndCount(options);
  }

  async save(bill: Bill): Promise<Bill | undefined> {
    return await this.billRepository.save(bill);
  }

  async update(bill: Bill): Promise<Bill | undefined> {
    return await this.save(bill);
  }

  async delete(bill: Bill): Promise<Bill | undefined> {
    return await this.billRepository.remove(bill);
  }
}
