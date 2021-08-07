import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from '../repository/order.repository';
import { Brackets } from 'typeorm';
import { OrderDetailsRepository } from '../repository/order-details.repository';
import { CustomerRepository } from '../repository/customer.repository';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(OrderRepository) private orderRepository: OrderRepository,
    @InjectRepository(OrderDetailsRepository) private orderDetailsRepository: OrderDetailsRepository,
    @InjectRepository(CustomerRepository) private customerRepository: CustomerRepository,
  ) {}
  async getOrderSaleReport(userId: string, filter = {}): Promise<any> {
    let queryString = '';

    if (filter['endDate'] && filter['startDate']) {
      queryString += `Order.createdDate  >= '${filter['startDate']}' AND  Order.createdDate <= '${filter['endDate']} 24:00:00'`;
    }
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select('COUNT(*)', 'count')
      .cache(3*3600)
      .where(`Order.sale = ${userId} and Order.status = 'CREATE_COD'`);
    if (queryString) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          sqb.where(queryString);
        })
      );
    }
    return await queryBuilder.getRawOne();
  }
  async getTop10BestSaleProduct(): Promise<any> {
    // select sum(quantity), productId, p.code,p.name from order_details join product p on p.id = order_details.productId group by productId ORDER BY sum(quantity) DESC limit 10
    const queryBuilder = this.orderDetailsRepository
      .createQueryBuilder('OrderDetails')
      .select(['product.code, product.name'])
      .addSelect('Sum(OrderDetails.quantity)', 'sum')
      .leftJoin('OrderDetails.product', 'product')
      .groupBy('OrderDetails.productId')
      .cache(3*3600)
      .orderBy('sum(OrderDetails.quantity)', 'DESC')
      .limit(10);
    return await queryBuilder.getRawMany();
  }

  //select c.code, c.contact_name, c.contact_name, sum(real_money) from `order` left join customer c on `order`.customerId = c.id where  customerId in (select id from customer where customer.saleId = 14) group by customerId order by sum(real_money) desc limit 10
  async getTop10BestCustomer(saleId): Promise<any> {
    const listCustomer = await this.customerRepository.find({
      where: {
        sale: saleId
      },
      cache: 3 * 3600
    });
    let andQueryString = ''
    if (listCustomer.length > 0) {
      andQueryString += ` Order.customer IN ${JSON.stringify(listCustomer.map(item => item.id ))
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select(['customer.code, customer.contactName'])
      .addSelect('Sum(Order.real_money)', 'sum')
      .leftJoin('Order.customer', 'customer')
      .where(andQueryString)
      .cache(3*3600)
      .groupBy('Order.customer')
      .orderBy('sum(Order.real_money)', 'DESC')
      .limit(10);
    return await queryBuilder.getRawMany();
  }
}
