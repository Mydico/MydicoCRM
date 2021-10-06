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
import { StoreInputRepository } from '../repository/store-input.repository';
import { StoreInputDetailsRepository } from '../repository/store-input-details.repository';
import { TransactionRepository } from '../repository/transaction.repository';
import Transaction from '../domain/transaction.entity';
import _ from 'lodash';
import StoreInput from '../domain/store-input.entity';
@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(OrderRepository) private orderRepository: OrderRepository,
    @InjectRepository(StoreInputRepository) private storeInputRepository: StoreInputRepository,
    @InjectRepository(StoreInputDetailsRepository) private storeInputDetailsRepository: StoreInputDetailsRepository,
    @InjectRepository(OrderDetailsRepository) private orderDetailsRepository: OrderDetailsRepository,
    @InjectRepository(IncomeDashboardRepository) private incomeDashboardRepository: IncomeDashboardRepository,
    @InjectRepository(DebtDashboardRepository) private debtDashboardRepository: DebtDashboardRepository,
    @InjectRepository(CustomerRepository) private customerRepository: CustomerRepository,
    @InjectRepository(TransactionRepository) private transactionRepository: TransactionRepository
  ) {}

  async getOrderSaleReport(userId: string, filter = {}): Promise<any> {
    let queryString = '';

    if (filter['endDate'] && filter['startDate']) {
      queryString += `Order.createdDate  >= '${filter['startDate']}' AND  Order.createdDate <= '${filter['endDate']} 23:59:59'`;
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
      .select(['department.code, department.name', 'department.id'])
      .addSelect('Sum(Order.real_money)', 'sum')
      .addSelect('Sum(Order.total_money)', 'total')
      .addSelect('Sum(Order.reduce_money)', 'reduce')
      .addSelect('count(Order.id)', 'count')
      .leftJoin('Order.department', 'department')
      .where(queryString)
      .andWhere(`Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .cache(3 * 3600)
      .groupBy('Order.department')
      .orderBy('sum(Order.real_money)', 'DESC');
    queryString = queryBuilderFunc('StoreInput', filter);

    const storeInputQueryBuilder = this.storeInputRepository
      .createQueryBuilder('StoreInput')
      .select('StoreInput.department')
      .addSelect('Sum(StoreInput.real_money)', 'return')
      .where(queryString)
      .andWhere(`StoreInput.status = 'APPROVED' and StoreInput.type = 'RETURN'`)
      .cache(3 * 3600)
      .groupBy('StoreInput.department');
    const returnMoney = await storeInputQueryBuilder.getRawMany();
    const reportDeprtment = await queryBuilder.getRawMany();
    const report = reportDeprtment.map(item => {
      const index = returnMoney.findIndex(product => product.departmentId === item.department_id);
      if (index >= 0) {
        return {
          ...item,
          return: Number(returnMoney[index].return)
        };
      }
      return item;
    });
    return report;
  }

  async getTop10Sale(filter = {}): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select(['user.code, user.firstName, user.lastName, user.id'])
      .addSelect('Sum(Order.real_money)', 'sum')
      .leftJoin('Order.sale', 'user')
      .where(queryString)
      .andWhere(`Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .cache(3 * 3600)
      .groupBy('Order.sale')
      .orderBy('sum(Order.real_money)', 'DESC')
      .limit(10);
    const result = await queryBuilder.getRawMany();

    queryString = queryBuilderFunc('StoreInput', filter);
    const productIds = result.map(item => item.user_id);
    const returnBuilder = await this.storeInputRepository
      .createQueryBuilder('StoreInput')
      .select(['saleId'])
      .addSelect('SUM(StoreInput.realMoney)', 'return')
      .where('saleId IN (:saleIds)', { saleIds: productIds.length > 0 ? productIds : '' })
      .andWhere(queryString)
      .andWhere(` StoreInput.status = 'APPROVED'`)
      .groupBy('StoreInput.saleId')
      .cache(3 * 3600)
      .getRawMany();
    console.log(returnBuilder)
    const finalArray = result.map(item => {
      const final = {
        ...item,
        return: 0
      };
      const founded = returnBuilder.filter(returnItem => returnItem.saleId === item.user_id);
      if (founded.length > 0) {
        final.return = founded[0].return;
      }
      return final;
    });

    return finalArray
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
      .andWhere(`order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
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
      .addSelect('Max(Order.customer)', 'customer')
      .leftJoin('Order.customer', 'customer')
      .where(queryString)
      .andWhere(`Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .cache(3 * 3600)
      .groupBy('Order.customer, customer.code, customer.name')
      .orderBy('sum(Order.real_money)', 'DESC')
      .limit(10);
    return await queryBuilder.getRawMany();
  }

  async getOrderSaleReportForManager(departmentVisible: string[], filter = {}): Promise<any> {
    let queryString = queryBuilderFunc('IncomeDashboard', filter);
    const queryBuilder = this.incomeDashboardRepository
      .createQueryBuilder('IncomeDashboard')
      .select('COUNT(*)', 'count')
      .cache(3 * 3600)
      .where(
        `IncomeDashboard.departmentId IN ${JSON.stringify(departmentVisible)
          .replace('[', '(')
          .replace(']', ')')}`
      )
      .andWhere(`IncomeDashboard.type = 'ORDER'`);
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
      .andWhere(`  order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
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
      .andWhere(`Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .cache(3 * 3600)
      .groupBy('Order.customer,customer.code,customer.name')
      .orderBy('sum(Order.real_money)', 'DESC')
      .limit(10);
    return await queryBuilder.getRawMany();
  }

  async getSumProductQuantity(filter): Promise<any> {
    let producQuery = '';
    if (filter['product']) {
      producQuery = ` product.id = ${filter['product']}`;
      delete filter['product'];
    }
    let queryString = queryBuilderFunc('order', filter);
    const queryBuilder = this.orderDetailsRepository
      .createQueryBuilder('OrderDetails')
      .select('SUM(OrderDetails.quantity)', 'count')
      .where(queryString)
      .leftJoin('OrderDetails.order', 'order')
      .leftJoin('OrderDetails.product', 'product')
      .andWhere(`order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .cache(3 * 3600);
    if (producQuery) {
      queryBuilder.andWhere(producQuery);
    }
    return await queryBuilder.getRawOne();
  }

  async getSumIncomeForProductReport(filter): Promise<any> {
    let producQuery = '';
    if (filter['product']) {
      producQuery = ` product.id = ${filter['product']}`;
      delete filter['product'];
    }
    let queryString = queryBuilderFunc('order', filter);
    const queryBuilder = this.orderDetailsRepository
      .createQueryBuilder('OrderDetails')
      .select('SUM(OrderDetails.priceTotal * OrderDetails.quantity)', 'count')
      .where(queryString)
      .leftJoin('OrderDetails.order', 'order')
      .leftJoin('OrderDetails.product', 'product')
      .andWhere(`order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .cache(3 * 3600);
    if (producQuery) {
      queryBuilder.andWhere(producQuery);
    }
    return await queryBuilder.getRawOne();
  }

  async getProductReport(options, filter): Promise<any> {
    let producQuery = '';
    if (filter['product']) {
      producQuery = ` product.id = ${filter['product']}`;
      delete filter['product'];
    }
    let queryString = queryBuilderFunc('order', filter);
    const queryBuilder = this.orderDetailsRepository
      .createQueryBuilder('OrderDetails')
      .select(['product.name', 'product.id'])
      .addSelect('SUM(OrderDetails.priceTotal) + SUM(OrderDetails.reduce)', 'total')
      .addSelect('SUM(OrderDetails.quantity)', 'count')
      .addSelect('SUM(OrderDetails.priceTotal)', 'sum')
      .addSelect('SUM(OrderDetails.reduce)', 'reduce')
      .leftJoin('OrderDetails.order', 'order')
      .leftJoin('OrderDetails.product', 'product')
      .where(queryString)
      .andWhere(`order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .groupBy('OrderDetails.productId')
      .orderBy(`sum`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .offset(options.skip)
      .limit(options.take)
      .cache(3 * 3600);
    const countBuilder = this.orderDetailsRepository
      .createQueryBuilder('OrderDetails')
      .select('count(*)', 'count')
      .where(queryString)
      .groupBy('OrderDetails.productId')
      .leftJoin('OrderDetails.order', 'order')
      .leftJoin('OrderDetails.product', 'product')
      .andWhere(`order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .cache(3 * 3600);
    if (producQuery) {
      queryBuilder.andWhere(producQuery);
      countBuilder.andWhere(producQuery);
    }

    const result = await queryBuilder.getRawMany();
    const count = await countBuilder.getRawMany();
    queryString = queryBuilderFunc('storeInput', filter);
    const productIds = result.map(item => item.product_id);
    const storeInputQueryBuilder = this.storeInputDetailsRepository
      .createQueryBuilder('StoreInputDetails')
      .select('SUM(StoreInputDetails.priceTotal) ', 'return')
      .addSelect(['product.id'])
      .where(queryString)
      .andWhere('StoreInputDetails.product IN (:saleIds)', { saleIds: productIds.length > 0 ? productIds : '' })
      .leftJoin('StoreInputDetails.product', 'product')
      .leftJoin('StoreInputDetails.storeInput', 'storeInput')
      .cache(3 * 3600)
      .groupBy('StoreInputDetails.product');
    if (producQuery) {
      storeInputQueryBuilder.andWhere(producQuery);
    }
    const returnProduct = await storeInputQueryBuilder.getRawMany();
    const final = result.map(item => {
      const index = returnProduct.findIndex(product => product.product_id === item.product_id);
      if (index >= 0) {
        return {
          ...item,
          return: Number(returnProduct[index].return)
        };
      }
      return item;
    });
    return [final, count.length];
  }

  async getSaleSummary(filter): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    const queryBuilder = await this.orderRepository.manager.connection
      .createQueryBuilder()
      .addSelect('SUM(Order.realMoney)', 'sum')
      .addSelect('SUM(Order.totalMoney)', 'count')
      .from(Order, 'Order')
      .where(queryString)
      .andWhere(` Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .cache(3 * 3600)
      .getRawOne();
    queryString = queryBuilderFunc('StoreInput', filter);

    const returnBuilder = await this.storeInputRepository.manager.connection
      .createQueryBuilder()
      .addSelect('SUM(StoreInput.realMoney)', 'return')
      .from(StoreInput, 'StoreInput')
      .where(queryString)
      .andWhere(`StoreInput.status = 'APPROVED' and StoreInput.type = 'RETURN'`)
      .cache(3 * 3600)
      .getRawOne();
    queryBuilder.sum = queryBuilder.sum - returnBuilder.return;
    return queryBuilder;
  }

  async getSaleReport(options, filter): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select(['sale.code', 'sale.id', 'sale.firstName', 'sale.lastName'])
      .addSelect('SUM(Order.realMoney)', 'realMoney')
      .addSelect('SUM(Order.totalMoney)', 'totalMoney')
      .addSelect('SUM(Order.reduceMoney)', 'reduce')
      .leftJoin('Order.sale', 'sale')
      .where(queryString)
      .andWhere(` Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .groupBy('Order.saleId')
      .orderBy(`realMoney`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .offset(options.skip)
      .limit(options.take)
      .cache(3 * 3600);
    const result = await queryBuilder.getRawMany();
    const saleId = result.map(item => item.sale_id);
    const count = await this.orderRepository
      .createQueryBuilder('Order')
      .select('count(*)', 'count')
      .where(queryString)
      .groupBy('Order.saleId')
      .leftJoin('Order.sale', 'sale')
      .andWhere(`Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .cache(3 * 3600)
      .getRawMany();
    queryString = queryBuilderFunc('StoreInput', filter);

    const returnBuilder = await this.storeInputRepository
      .createQueryBuilder('StoreInput')
      .select(['saleId'])
      .addSelect('SUM(StoreInput.realMoney)', 'return')
      .where('saleId IN (:saleIds)', { saleIds: saleId.length > 0 ? saleId : '' })
      .andWhere(queryString)
      .andWhere(` StoreInput.status = 'APPROVED'`)
      .groupBy('StoreInput.saleId')
      .cache(3 * 3600)
      .getRawMany();
    const finalArray = result.map(item => {
      const founded = returnBuilder.filter(returnItem => returnItem.saleId === item.sale_id);
      const final = {
        ...item,
        return: 0
      };
      if (founded.length > 0) {
        final.return = founded[0].return;
      }
      return final;
    });

    return [finalArray, count.length];
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

  async getCustomerPriceSummary(filter): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    queryString = queryString.replace('Order.typeId', 'customer.typeId');
    const queryBuilder = this.orderRepository.manager.connection
      .createQueryBuilder()
      .from(Order, 'Order')
      .addSelect('SUM(Order.realMoney)', 'realMoney')
      .leftJoin('Order.customer', 'customer')
      .leftJoin('customer.type', 'type')
      .where(queryString)
      .andWhere(` Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .groupBy('Order.customerId')
      .cache(3 * 3600);
    return await queryBuilder.getRawOne();
  }

  async getCustomerReport(options, filter): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    queryString = queryString.replace('Order.typeId', 'customer.typeId');
    const queryBuilder = this.orderRepository.manager.connection
      .createQueryBuilder()
      .from(Order, 'Order')
      .select(['customer.id', 'customer.code', 'customer.name'])
      .addSelect('SUM(Order.realMoney)', 'realMoney')
      .addSelect('SUM(Order.totalMoney)', 'totalMoney')
      .leftJoin('Order.customer', 'customer')
      .leftJoin('customer.type', 'type')
      .where(queryString)
      .andWhere(` Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .groupBy('Order.customerId, customer.code, customer.name, customer.id ')
      .offset(options.skip)
      .limit(options.take)
      .cache(3 * 3600);
    const result = await queryBuilder.getRawMany();

    const count = await this.orderRepository
      .createQueryBuilder('Order')
      .select('count(*)', 'count')
      .where(queryString)
      .andWhere(` Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .groupBy('Order.customerId')
      .leftJoin('Order.customer', 'customer')
      .leftJoin('customer.type', 'type')
      .leftJoin('Order.sale', 'sale')
      .cache(3 * 3600)
      .getRawMany();
    const customerId = result.map(item => item.customer_id);
    queryString = queryBuilderFunc('StoreInput', filter);
    queryString = queryString.replace('StoreInput.typeId', 'customer.typeId');

    const storeInputQueryBuilder = this.storeInputRepository
      .createQueryBuilder('StoreInput')
      .select(['customer.id'])
      .addSelect('Sum(StoreInput.real_money)', 'return')
      .leftJoin('StoreInput.customer', 'customer')
      .leftJoin('customer.type', 'type')
      .where('StoreInput.customerId IN (:saleIds)', { saleIds: customerId.length > 0 ? customerId : '' })
      .andWhere(queryString)
      .cache(3 * 3600)
      .groupBy('StoreInput.customerId');
    const returnMoney = await storeInputQueryBuilder.getRawMany();

    queryString = queryBuilderFunc('Transaction', filter);
    queryString = queryString.replace('Transaction.typeId', 'customer.typeId');

    const transactionQueryBuilder = this.transactionRepository.manager.connection
      .createQueryBuilder()
      .from(Transaction, 'Transaction')
      .addSelect('SUM(Transaction.total_money)-SUM(Transaction.collect_money)-SUM(Transaction.refund_money)', 'debt')
      .leftJoin('Transaction.customer', 'customer')
      .leftJoin('customer.type', 'type')
      .where(queryString)
      .where('Transaction.customerId IN (:saleIds)', { saleIds: customerId.length > 0 ? customerId : '' })
      .groupBy('Transaction.customerId')
      .orderBy(`MAX(Transaction.${Object.keys(options.order)[0] || 'createdDate'})`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .offset(options.skip)
      .limit(options.take)
      .cache(3 * 3600);
    const debt = await transactionQueryBuilder.getRawMany();

    const finalArray = result.map(item => {
      const founded = returnMoney.filter(returnItem => returnItem.customer_id === item.customer_id);
      const final = {
        ...item,
        return: 0,
        debt: 0
      };
      if (founded.length > 0) {
        final.return = founded[0].return;
      }
      const foundedTransactions = debt.filter(returnItem => returnItem.customer_id === item.customer_id);
      if (foundedTransactions.length > 0) {
        final.debt = founded[0].debt;
      }
      return final;
    });

    return [finalArray, count.length];
  }

  async getPromotionPrice(filter): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select('sum(Order.realMoney)', 'sum')
      .where(queryString)
      .andWhere(` Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
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
          .andWhere(` Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
          .groupBy('Order.customerId');
      }, 'totals');
    return await queryBuilder.getRawOne();
  }

  async getPromotionReport(options, filter): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .select(['customer.id', 'customer.code', 'customer.name'])
      .addSelect('SUM(Order.realMoney)', 'realMoney')
      .addSelect('SUM(Order.totalMoney)', 'totalMoney')
      .addSelect('SUM(Order.reduceMoney)', 'reduce')
      .leftJoin('Order.customer', 'customer')
      .leftJoin('Order.sale', 'sale')
      .leftJoin('Order.promotion', 'promotion')
      .leftJoin('Order.promotionItem', 'promotionItem')
      .where(queryString)
      .andWhere(` Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .groupBy('Order.customerId, customer.id, customer.code, customer.name')
      .orderBy(`realMoney`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .offset(options.skip)
      .limit(options.take)
      .cache(3 * 3600);
    const count = await this.orderRepository
      .createQueryBuilder('Order')
      .select('count(*)', 'count')
      .where(queryString)
      .andWhere(` Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
      .groupBy('Order.customerId')
      .leftJoin('Order.customer', 'customer')
      .leftJoin('Order.sale', 'sale')
      .cache(3 * 3600)
      .getRawMany();
    const result = await queryBuilder.getRawMany();
    const customerId = result.map(item => item.customer_id);
    queryString = queryBuilderFunc('StoreInput', filter);
    console.log(queryString);
    const returnBuilder = await this.storeInputRepository
      .createQueryBuilder('StoreInput')
      .select(['customer.id'])
      .addSelect('Sum(StoreInput.real_money)', 'return')
      .leftJoin('StoreInput.customer', 'customer')
      .leftJoin('StoreInput.promotion', 'promotion')
      .leftJoin('StoreInput.promotionItem', 'promotionItem')
      .leftJoin('StoreInput.sale', 'sale')
      .where('StoreInput.customerId IN (:saleIds)', { saleIds: customerId.length > 0 ? customerId : '' })
      .andWhere(queryString)
      .andWhere(`StoreInput.status = 'APPROVED' and StoreInput.type = 'RETURN'`)
      .cache(3 * 3600)
      .groupBy('StoreInput.customerId')
      .getRawMany();

    const finalArray = result.map(item => {
      const final = {
        ...item,
        return: 0
      };
      const founded = returnBuilder.filter(returnItem => returnItem.customer_id === item.customer_id);
      if (founded.length > 0) {
        final.return = founded[0].return;
      }
      return final;
    });

    return [finalArray, count.length];
  }
}
