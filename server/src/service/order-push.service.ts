import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import OrderPush from '../domain/order-push.entity';
import { OrderPushRepository } from '../repository/order-push.repository';

const relationshipNames = [];

@Injectable()
export class OrderPushService {
  logger = new Logger('OrderPushService');

  constructor(@InjectRepository(OrderPushRepository) private orderPushRepository: OrderPushRepository) {}

  async findById(id: string): Promise<OrderPush | undefined> {
    const options = { relations: relationshipNames };
    return await this.orderPushRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<OrderPush>): Promise<OrderPush | undefined> {
    return await this.orderPushRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<OrderPush>): Promise<[OrderPush[], number]> {
    options.relations = relationshipNames;
    return await this.orderPushRepository.findAndCount(options);
  }

  async save(orderPush: OrderPush): Promise<OrderPush | undefined> {
    return await this.orderPushRepository.save(orderPush);
  }

  async update(orderPush: OrderPush): Promise<OrderPush | undefined> {
    return await this.save(orderPush);
  }

  async delete(orderPush: OrderPush): Promise<OrderPush | undefined> {
    return await this.orderPushRepository.remove(orderPush);
  }
}
