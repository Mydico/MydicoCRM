import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from '../repository/order.repository';
import { Brackets } from 'typeorm';
import { OrderDetailsRepository } from '../repository/order-details.repository';
import { CustomerRepository } from '../repository/customer.repository';
import { queryBuilderFunc } from '../utils/helper/permission-normalization';
import Customer from '../domain/customer.entity';
import Order from '../domain/order.entity';
import { IncomeDashboardRepository } from '../repository/income-dashboard.repository';
import { DebtDashboardRepository } from '../repository/debt-dashboard.repository';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(OrderRepository) private orderRepository: OrderRepository,
    @InjectRepository(OrderDetailsRepository) private orderDetailsRepository: OrderDetailsRepository,
    @InjectRepository(IncomeDashboardRepository) private incomeDashboardRepository: IncomeDashboardRepository,
    @InjectRepository(DebtDashboardRepository) private debtDashboardRepository: DebtDashboardRepository,
    @InjectRepository(CustomerRepository) private customerRepository: CustomerRepository
  ) {}

  async getOrderSaleReport(userId: string, filter = {}): Promise<any> {
    let queryString = '';

    if (filter['endDate'] && filter['startDate']) {
      queryString += `Order.createdDate  >= '${filter['startDate']}' AND  Order.createdDate <= '${filter['endDate']} 24:00:00'`;
    }
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select('COUNT(*)', 'count')
      .cache(3 * 3600)
      .where(`Order.sale = ${userId} and Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`);
    if (queryString) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          sqb.where(queryString);
        })
      );
    }
    return await queryBuilder.getRawOne();
  }

  async getOrderReport(filter = {}): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);

    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select('COUNT(*)', 'count')
      .cache(3 * 3600)
      .where(`Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`);
    if (queryString) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          sqb.where(queryString);
        })
      );
    }
    return await queryBuilder.getRawOne();
  }

  async getNewCustomerReport(filter = {}): Promise<any> {
    let queryString = queryBuilderFunc('Customer', filter);

    const queryBuilder = this.customerRepository.manager.connection
      .createQueryBuilder()
      .select('count(*)', 'count')
      .from(qb => {
        return qb
          .select('Customer.id')
          .addSelect('COUNT(order.id) > 0', 'count')
          .from(Customer, 'Customer')
          .innerJoin('Customer.order', 'order')
          .where(queryString)
          .groupBy('Customer.id');
      }, 'totals');
    return await queryBuilder.getRawOne();
  }

  async getIncome(filter = {}): Promise<any> {
    //select sum(case when i.type = 'ORDER' then i.amount when  i.type = 'RETURN' then -i.amount end) as sum from income_dashboard i

    let queryString = queryBuilderFunc('IncomeDashboard', filter);

    const queryBuilder = this.incomeDashboardRepository
      .createQueryBuilder('IncomeDashboard')
      .select(
        `sum(case when IncomeDashboard.type = 'ORDER' then IncomeDashboard.amount when  IncomeDashboard.type = 'RETURN' then -IncomeDashboard.amount end)`,
        'sum'
      )
      .where(queryString);

    return await queryBuilder.getRawOne();
  }

  async getDebt(filter = {}): Promise<any> {
    let queryString = queryBuilderFunc('DebtDashboard', filter);
    const queryBuilder = this.debtDashboardRepository
      .createQueryBuilder('DebtDashboard')
      .select(`sum(case when DebtDashboard.type = 'DEBT' then DebtDashboard.amount else -DebtDashboard.amount end)`, 'sum')
      .where(queryString);

    return await queryBuilder.getRawOne();
  }

  async getSaleReportByDepartment(filter = {}): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select(['department.code, department.name'])
      .addSelect('Sum(Order.real_money)', 'sum')
      .leftJoin('Order.department', 'department')
      .where(queryString)
      .cache(3 * 3600)
      .groupBy('Order.department')
      .orderBy('sum(Order.real_money)', 'DESC');

    return await queryBuilder.getRawMany();
  }

  async getTop10Sale(filter = {}): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);

    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select(['user.code, user.firstName, user.lastName'])
      .addSelect('Sum(Order.real_money)', 'sum')
      .leftJoin('Order.sale', 'user')
      .where(queryString)
      .cache(3 * 3600)
      .groupBy('Order.sale')
      .orderBy('sum(Order.real_money)', 'DESC')
      .limit(10);

    return await queryBuilder.getRawMany();
  }

  async getTop10Product(filter = {}): Promise<any> {
    // select sum(quantity), productId, p.code,p.name from order_details join product p on p.id = order_details.productId group by productId ORDER BY sum(quantity) DESC limit 10
    let queryString = queryBuilderFunc('order', filter);

    const queryBuilder = this.orderDetailsRepository
      .createQueryBuilder('OrderDetails')
      .select(['product.code, product.name'])
      .addSelect('Sum(OrderDetails.quantity)', 'sum')
      .leftJoin('OrderDetails.product', 'product')
      .leftJoin('OrderDetails.order', 'order')
      .groupBy('OrderDetails.productId')
      .where(queryString)
      .cache(3 * 3600)
      .orderBy('sum(OrderDetails.quantity)', 'DESC')
      .limit(10);
    return await queryBuilder.getRawMany();
  }

  async getTop10Customer(filter = {}): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select(['customer.code, customer.name'])
      .addSelect('Sum(Order.real_money)', 'sum')
      .leftJoin('Order.customer', 'customer')
      .where(queryString)
      .cache(3 * 3600)
      .groupBy('Order.customer')
      .orderBy('sum(Order.real_money)', 'DESC')
      .limit(10);
    return await queryBuilder.getRawMany();
  }

  async getOrderSaleReportForManager(departmentVisible: string[], filter = {}): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select('COUNT(*)', 'count')
      .cache(3 * 3600)
      .where(
        `Order.department IN ${JSON.stringify(departmentVisible)
          .replace('[', '(')
          .replace(']', ')')} and Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`
      );
    if (queryString) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          sqb.where(queryString);
        })
      );
    }
    return await queryBuilder.getRawOne();
  }
  async getTop10BestSaleProduct(filter): Promise<any> {
    // select sum(quantity), productId, p.code,p.name from order_details join product p on p.id = order_details.productId group by productId ORDER BY sum(quantity) DESC limit 10
    let queryString = queryBuilderFunc('order', filter);
    if (filter['saleId']) {
      const listCustomer = await this.orderRepository.find({
        where: {
          sale: filter['saleId']
        },
        cache: 3 * 3600
      });
    
      if (listCustomer.length > 0) {
        queryString += ` AND OrderDetails.order IN ${JSON.stringify(listCustomer.map(item => item.id))
          .replace('[', '(')
          .replace(']', ')')}`;
      }
    }

    const queryBuilder = this.orderDetailsRepository
      .createQueryBuilder('OrderDetails')
      .select(['product.code, product.name'])
      .addSelect('Sum(OrderDetails.quantity)', 'sum')
      .leftJoin('OrderDetails.product', 'product')
      .leftJoin('OrderDetails.order', 'order')
      .groupBy('OrderDetails.productId')
      .where(queryString)
      .cache(3 * 3600)
      .orderBy('sum(OrderDetails.quantity)', 'DESC')
      .limit(10);
    return await queryBuilder.getRawMany();
  }

  //select c.code, c.contact_name, c.contact_name, sum(real_money) from `order` left join customer c on `order`.customerId = c.id where  customerId in (select id from customer where customer.saleId = 14) group by customerId order by sum(real_money) desc limit 10
  async getTop10BestCustomer(filter): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    if (filter['saleId']) {
      const listCustomer = await this.customerRepository.find({
        where: {
          sale: filter['saleId']
        },
        cache: 3 * 3600
      });
      if (listCustomer.length > 0) {
        queryString += ` Order.customer IN ${JSON.stringify(listCustomer.map(item => item.id))
          .replace('[', '(')
          .replace(']', ')')}`;
      }
    }


    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select(['customer.code, customer.name'])
      .addSelect('Sum(Order.real_money)', 'sum')
      .leftJoin('Order.customer', 'customer')
      .where(queryString)
      .cache(3 * 3600)
      .groupBy('Order.customer')
      .orderBy('sum(Order.real_money)', 'DESC')
      .limit(10);
    return await queryBuilder.getRawMany();
  }

  async getSumProductQuantity(filter): Promise<any> {
    let queryString = queryBuilderFunc('order', filter);
    const queryBuilder = this.orderDetailsRepository
      .createQueryBuilder('OrderDetails')
      .select('SUM(OrderDetails.quantity)', 'count')
      .leftJoin('OrderDetails.order', 'order')
      .cache(3 * 3600);
    if (queryString) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          sqb.where(queryString);
        })
      );
    }
    return await queryBuilder.getRawOne();
  }

  async getSumIncomeForProductReport(filter): Promise<any> {
    let queryString = queryBuilderFunc('order', filter);
    const queryBuilder = this.orderDetailsRepository
      .createQueryBuilder('OrderDetails')
      .select('SUM(OrderDetails.priceReal)', 'count')
      .leftJoin('OrderDetails.order', 'order')
      .cache(3 * 3600);
    if (queryString) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          sqb.where(queryString);
        })
      );
    }
    return await queryBuilder.getRawOne();
  }

  async getProductReport(options, filter): Promise<any> {
    let queryString = queryBuilderFunc('order', filter);
    const queryBuilder = this.orderDetailsRepository
      .createQueryBuilder('OrderDetails')
      .select(['product.name'])
      .addSelect('SUM(OrderDetails.priceReal)', 'sum')
      .addSelect('SUM(OrderDetails.quantity)', 'count')
      .leftJoin('OrderDetails.order', 'order')
      .leftJoin('OrderDetails.product', 'product')
      .where(queryString)
      .groupBy('OrderDetails.productId')
      .orderBy(`sum`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .offset(options.skip)
      .limit(options.take)
      .cache(3 * 3600);

    const count = await this.orderDetailsRepository
      .createQueryBuilder('OrderDetails')
      .select('count(*)', 'count')
      .where(queryString)
      .groupBy('OrderDetails.productId')
      .leftJoin('OrderDetails.order', 'order')
      .cache(3 * 3600)
      .getRawMany();
    const result = await queryBuilder.getRawMany();
    return [result, count.length];
  }

  async getSaleSummary(filter): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    const queryBuilder = this.orderRepository.manager.connection
      .createQueryBuilder()
      .addSelect('SUM(Order.realMoney)', 'sum')
      .addSelect('SUM(Order.totalMoney)', 'count')
      .from(Order, 'Order')
      .where(queryString)
      .cache(3 * 3600);
    return await queryBuilder.getRawOne();
  }

  async getSaleReport(options, filter): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select(['sale.code', 'sale.firstName', 'sale.lastName'])
      .addSelect('SUM(Order.realMoney)', 'realMoney')
      .addSelect('SUM(Order.totalMoney)', 'totalMoney')
      .leftJoin('Order.sale', 'sale')
      .where(queryString)
      .groupBy('Order.saleId')
      .orderBy(`realMoney`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .offset(options.skip)
      .limit(options.take)
      .cache(3 * 3600);

    const count = await this.orderRepository
      .createQueryBuilder('Order')
      .select('count(*)', 'count')
      .where(queryString)
      .groupBy('Order.saleId')
      .leftJoin('Order.sale', 'sale')
      .cache(3 * 3600)
      .getRawMany();
    const result = await queryBuilder.getRawMany();
    return [result, count.length];
  }

  async getCustomerSummary(filter): Promise<any> {
    let queryString = queryBuilderFunc('Customer', filter);
    const queryBuilder = this.customerRepository.manager.connection
      .createQueryBuilder()
      .addSelect('count(*)', 'count')
      .from(Customer, 'Customer')
      .where(queryString)
      .cache(3 * 3600);
    return await queryBuilder.getRawOne();
  }

  async getCustomerReport(options, filter): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select(['customer.code', 'customer.name'])
      .addSelect('SUM(Order.realMoney)', 'realMoney')
      .addSelect('SUM(Order.totalMoney)', 'totalMoney')
      .leftJoin('Order.customer', 'customer')
      .leftJoin('Order.sale', 'sale')
      .where(queryString)
      .groupBy('Order.customerId')
      .orderBy(`realMoney`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .offset(options.skip)
      .limit(options.take)
      .cache(3 * 3600);

    const count = await this.orderRepository
      .createQueryBuilder('Order')
      .select('count(*)', 'count')
      .where(queryString)
      .groupBy('Order.customerId')
      .leftJoin('Order.customer', 'customer')
      .leftJoin('Order.sale', 'sale')
      .cache(3 * 3600)
      .getRawMany();
    const result = await queryBuilder.getRawMany();
    return [result, count.length];
  }

  async getPromotionPrice(filter): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select('sum(Order.realMoney)', 'sum')
      .where(queryString)
      .cache(3 * 3600);
    return await queryBuilder.getRawOne();
  }

  //select count(*) from (select customerId from `order` group by customerId) as totals
  async getPromotionCustomer(filter): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);

    const queryBuilder = this.customerRepository.manager.connection
      .createQueryBuilder()
      .select('count(*)', 'count')
      .from(qb => {
        return qb
          .select('Order.customerId')
          .from(Order, 'Order')
          .where(queryString)
          .groupBy('Order.customerId');
      }, 'totals');
    return await queryBuilder.getRawOne();
    return await queryBuilder.getRawOne();
  }

  async getPromotionReport(options, filter): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select(['customer.code', 'customer.name'])
      .addSelect('SUM(Order.realMoney)', 'realMoney')
      .addSelect('SUM(Order.totalMoney)', 'totalMoney')
      .leftJoin('Order.customer', 'customer')
      .leftJoin('Order.sale', 'sale')
      .where(queryString)
      .groupBy('Order.customerId')
      .orderBy(`realMoney`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .offset(options.skip)
      .limit(options.take)
      .cache(3 * 3600);

    const count = await this.orderRepository
      .createQueryBuilder('Order')
      .select('count(*)', 'count')
      .where(queryString)
      .groupBy('Order.customerId')
      .leftJoin('Order.customer', 'customer')
      .leftJoin('Order.sale', 'sale')
      .cache(3 * 3600)
      .getRawMany();
    const result = await queryBuilder.getRawMany();
    return [result, count.length];
  }
}
