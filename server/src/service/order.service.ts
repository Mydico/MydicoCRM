import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageRequest } from 'src/domain/base/pagination.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Order from '../domain/order.entity';
import { OrderRepository } from '../repository/order.repository';
import { Request } from 'express';
import { BillService } from './bill.service';
import Bill from '../domain/bill.entity';
import { OrderStatus } from '../domain/enumeration/order-status';
import { CreateBillDTO } from './dto/bill-dto';

const relationshipNames = [];
relationshipNames.push('city');
relationshipNames.push('district');
relationshipNames.push('wards');
relationshipNames.push('customer');
relationshipNames.push('orderDetails');
relationshipNames.push('promotion');
relationshipNames.push('store');

@Injectable()
export class OrderService {
  logger = new Logger('OrderService');

  constructor(@InjectRepository(OrderRepository) private orderRepository: OrderRepository, private readonly billService: BillService) {}

  async findById(id: string): Promise<Order | undefined> {
    const options = { relations: relationshipNames };
    return await this.orderRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Order>): Promise<Order | undefined> {
    return await this.orderRepository.findOne(options);
  }

  async findAndCount(pageRequest: PageRequest, req: Request): Promise<[Order[], number]> {
    // options.relations = relationshipNames;
    let queryString = "Order.status <> 'DELETED'";
    Object.keys(req.query).forEach((item, index) => {
      if (item !== 'page' && item !== 'size' && item !== 'sort') {
        queryString += `Order.${item} like '%${req.query[item]}%' ${Object.keys(req.query).length - 1 === index ? '' : 'OR '}`;
      }
    });

    return await this.orderRepository
      .createQueryBuilder('Order')
      .leftJoinAndSelect('Order.customer', 'customer')
      .leftJoinAndSelect('Order.promotion', 'promotion')
      .leftJoinAndSelect('Order.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.product', 'product')
      .where(queryString)
      .orderBy('Order.createdDate')
      .skip(pageRequest.page * pageRequest.size)
      .take(pageRequest.size)
      .getManyAndCount();
    // return await this.orderRepository.findAndCount(options);
  }

  async save(order: Order): Promise<Order | undefined> {
    const created = await this.orderRepository.save(order);
    console.log(created)
    if (created.status === OrderStatus.CREATE_COD) {
      const bill = new Bill();
      bill.code = `VD-${created.code}`;
      bill.customer = created.customer;
      bill.order = created;
      bill.store = created.store;
      console.log(bill)
      await this.billService.save(bill);
    }

    return created;
  }

  async update(order: Order): Promise<Order | undefined> {
    return await this.save(order);
  }

  async delete(order: Order): Promise<Order | undefined> {
    return await this.orderRepository.remove(order);
  }
}
