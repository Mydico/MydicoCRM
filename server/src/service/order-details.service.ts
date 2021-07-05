import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import OrderDetails from '../domain/order-details.entity';
import { OrderDetailsRepository } from '../repository/order-details.repository';

const relationshipNames = [];
relationshipNames.push('product');

@Injectable()
export class OrderDetailsService {
    logger = new Logger('OrderDetailsService');

    constructor(@InjectRepository(OrderDetailsRepository) private orderDetailsRepository: OrderDetailsRepository) {}

    async findById(id: string): Promise<OrderDetails | undefined> {
        const options = { relations: relationshipNames };
        return await this.orderDetailsRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<OrderDetails>): Promise<OrderDetails | undefined> {
        return await this.orderDetailsRepository.findOne(options);
    }

    async findAndCountByOrderId(options: FindManyOptions<OrderDetails>): Promise<[OrderDetails[], number]> {
        options.relations = relationshipNames;
        return await this.orderDetailsRepository.findAndCount(options);
    }

    async findAndCount(options: FindManyOptions<OrderDetails>): Promise<[OrderDetails[], number]> {
        options.relations = relationshipNames;
        return await this.orderDetailsRepository.findAndCount(options);
    }

    async save(orderDetails: OrderDetails): Promise<OrderDetails | undefined> {
        return await this.orderDetailsRepository.save(orderDetails);
    }

    async update(orderDetails: OrderDetails): Promise<OrderDetails | undefined> {
        return await this.save(orderDetails);
    }

    async delete(orderDetails: OrderDetails): Promise<OrderDetails | undefined> {
        return await this.orderDetailsRepository.remove(orderDetails);
    }
}
