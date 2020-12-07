import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblOrder from '../domain/tbl-order.entity';
import { TblOrderRepository } from '../repository/tbl-order.repository';

const relationshipNames = [];

@Injectable()
export class TblOrderService {
  logger = new Logger('TblOrderService');

  constructor(@InjectRepository(TblOrderRepository) private tblOrderRepository: TblOrderRepository) {}

  async findById(id: string): Promise<TblOrder | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblOrderRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblOrder>): Promise<TblOrder | undefined> {
    return await this.tblOrderRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblOrder>): Promise<[TblOrder[], number]> {
    options.relations = relationshipNames;
    return await this.tblOrderRepository.findAndCount(options);
  }

  async save(tblOrder: TblOrder): Promise<TblOrder | undefined> {
    return await this.tblOrderRepository.save(tblOrder);
  }

  async update(tblOrder: TblOrder): Promise<TblOrder | undefined> {
    return await this.save(tblOrder);
  }

  async delete(tblOrder: TblOrder): Promise<TblOrder | undefined> {
    return await this.tblOrderRepository.remove(tblOrder);
  }
}
