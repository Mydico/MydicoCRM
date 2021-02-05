import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Bill from '../domain/bill.entity';
import { BillRepository } from '../repository/bill.repository';
import { Request } from 'express';
import { PageRequest } from '../domain/base/pagination.entity';

const relationshipNames = [];
relationshipNames.push('customer')
relationshipNames.push('order')
relationshipNames.push('store')

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

  async findAndCount(pageRequest: PageRequest, req: Request): Promise<[Bill[], number]> {
    // options.relations = relationshipNames;
    // return await this.billRepository.findAndCount(options);
    let queryString = "Bill.status <> 'DELETED'";
    Object.keys(req.query).forEach((item, index) => {
      if (item !== 'page' && item !== 'size' && item !== 'sort') {
        queryString += `Bill.${item} like '%${req.query[item]}%' ${Object.keys(req.query).length - 1 === index ? '' : 'OR '}`;
      }
    });

    return await this.billRepository
      .createQueryBuilder('Bill')
      .leftJoinAndSelect('Bill.customer', 'customer')
      .leftJoinAndSelect('Bill.store', 'store')
      .leftJoinAndSelect('Bill.order', 'order')
      .leftJoinAndSelect('order.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.product', 'product')
      .where(queryString)
      .orderBy('Bill.createdDate')
      .skip(pageRequest.page * pageRequest.size)
      .take(pageRequest.size)
      .getManyAndCount();
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
