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
import { User } from '../domain/user.entity';
import { BillRepository } from '../repository/bill.repository';
import Department from '../domain/department.entity';
@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(OrderRepository) private orderRepository: OrderRepository,
    @InjectRepository(StoreInputRepository) private storeInputRepository: StoreInputRepository,
    @InjectRepository(StoreInputDetailsRepository) private storeInputDetailsRepository: StoreInputDetailsRepository,
    @InjectRepository(OrderDetailsRepository) private orderDetailsRepository: OrderDetailsRepository,
    @InjectRepository(IncomeDashboardRepository) private incomeDashboardRepository: IncomeDashboardRepository,
    @InjectRepository(DebtDashboardRepository) private billRepository: BillRepository,
    @InjectRepository(CustomerRepository) private customerRepository: CustomerRepository,
    @InjectRepository(TransactionRepository) private transactionRepository: TransactionRepository
  ) {}

  async countDebit(
    filter = {},
    departmentVisible = [],
    isEmployee: boolean,
    allowToSeeAll: boolean,
    currentUser: User
  ): Promise<[Transaction[], number]> {
    let queryString = '1=1';
    let andQueryString = '';

    if (departmentVisible.length > 0) {
      queryString += ` AND Transaction.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (filter['endDate']) {
      queryString += ` AND Transaction.createdDate <='${filter['endDate']} 23:59:59'`;
    }
    if (!allowToSeeAll) {
      if (isEmployee) {
        queryString += ` AND Transaction.sale = ${currentUser.id}`;
      }
      if (currentUser.branch) {
        if (!currentUser.branch.seeAll) {
          queryString += ` AND Transaction.branch = ${currentUser.branch.id}`;
        }
      }
    }
    delete filter['startDate'];
    delete filter['endDate'];
    Object.keys(filter).forEach((item, index) => {
      const specialCharacter = filter[item].includes('_') ? filter[item].replace('_', '\\_') : filter[item];
      andQueryString += ` Transaction.${item} like '%${specialCharacter}%' ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
    });
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select('SUM(Transaction.total_money)-SUM(Transaction.collect_money)-SUM(Transaction.refund_money)', 'sum')
      .where(queryString);

    if (andQueryString) {
      queryBuilder.andWhere(andQueryString);
    }
    return await queryBuilder.getRawOne();
  }

  async getOrderIncludesProductId(options, filter = {}): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    queryString = queryString.replace('Order.productId', 'product.id');

    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .leftJoinAndSelect('Order.customer', 'customer')
      .leftJoinAndSelect('Order.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.product', 'product')
      .leftJoinAndSelect('Order.promotion', 'promotion')
      .leftJoinAndSelect('promotion.customerType', 'customerType')
      .leftJoinAndSelect('Order.sale', 'sale')
      .leftJoinAndSelect('Order.department', 'department')
      .cache(3 * 3600)
      .skip(options.skip)
      .take(options.take)
      .where(queryString)
      .orderBy({
        'Order.createdDate': options.order[Object.keys(options.order)[0]] || 'DESC',
      })
      const count = this.orderRepository
      .createQueryBuilder('Order')
      .leftJoinAndSelect('Order.customer', 'customer')
      .leftJoinAndSelect('Order.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.product', 'product')
      .leftJoinAndSelect('Order.promotion', 'promotion')
      .leftJoinAndSelect('promotion.customerType', 'customerType')
      .leftJoinAndSelect('Order.sale', 'sale')
      .leftJoinAndSelect('Order.department', 'department')
      .where(queryString)
      .orderBy(`Order.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take)
      .cache(3 * 3600)

      const lastResult: [Order[], number] = [[],0] 
      const result = await queryBuilder.getMany();
      lastResult[1] = await count.getCount();
      lastResult[0] = result.map(item => ({
        ...item,
        orderDetails : item.orderDetails.reverse()
      }))
      return lastResult;
  }

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
    let queryString = queryBuilderFunc('Transaction', filter);

    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select('COUNT(*)', 'count')
      .where(`type = 'DEBIT'`)
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

    let queryString = queryBuilderFunc('Transaction', filter);

    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(
        `sum(case when Transaction.type = 'DEBIT' then Transaction.total_money when  Transaction.type = 'RETURN' then -Transaction.refund_money else 0 end)`,
        'sum'
      )
      .where(queryString);

    return await queryBuilder.getRawOne();
  }

  async getDebt(filter = {}): Promise<any> {
    let queryString = queryBuilderFunc('Transaction', filter, true);
    // const queryBuilder = this.debtDashboardRepository
    //   .createQueryBuilder('DebtDashboard')
    //   .select(`sum(case when DebtDashboard.type = 'DEBT' then DebtDashboard.amount else -DebtDashboard.amount end)`, 'sum')
    //   .where(queryString);
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select('SUM(Transaction.total_money)-SUM(Transaction.collect_money)-SUM(Transaction.refund_money)', 'sum')
      .where(queryString);
    return await queryBuilder.getRawOne();
  }

  async getSaleReportByDepartment(filter = {}): Promise<any> {
    // select departmentId,  sum(case when type = 'DEBIT' then total_money when  type = 'RETURN' then -refund_money else 0 end)
    //   from transaction
    //   where createdDate >= '2021-10-01'
    //     and createdDate <= '2021-10-08 23:59:59'
    //   group by departmentId
    let queryString = queryBuilderFunc('Transaction', filter);
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['department.code, department.name', 'department.id'])
      .addSelect(`sum(case when type = 'DEBIT' then total_money else 0 end)`, 'total')
      .addSelect(`sum(case when type = 'DEBIT' then total_money when  type = 'RETURN' then -refund_money else 0 end)`, 'real')
      .addSelect(`sum(case when type = 'RETURN' then refund_money else 0 end)`, 'return')
      .addSelect(`count(case when type = 'DEBIT' then 1 end)`, 'count')
      .leftJoin('Transaction.department', 'department')
      .where(queryString)
      .cache(3 * 3600)
      .groupBy('Transaction.department')
      .orderBy('Transaction.department', 'ASC');
    // queryString = queryBuilderFunc('StoreInput', filter);

    // const storeInputQueryBuilder = this.storeInputRepository
    //   .createQueryBuilder('StoreInput')
    //   .select('StoreInput.department')
    //   .addSelect('Sum(StoreInput.real_money)', 'return')
    //   .where(queryString)
    //   .andWhere(`StoreInput.status = 'APPROVED' and StoreInput.type = 'RETURN'`)
    //   .cache(3 * 3600)
    //   .groupBy('StoreInput.department');
    // const returnMoney = await storeInputQueryBuilder.getRawMany();
    return await queryBuilder.getRawMany();
    // const report = reportDeprtment.map(item => {
    //   const index = returnMoney.findIndex(product => product.departmentId === item.department_id);
    //   if (index >= 0) {
    //     return {
    //       ...item,
    //       return: Number(returnMoney[index].return)
    //     };
    //   }
    //   return item;
    // });  }
  }

  async getSaleReportByDepartmentExternal(filter = {}, externalDepartment: Department): Promise<any> {
    let queryString = queryBuilderFunc('Transaction', filter);
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['department.code, department.name', 'department.id'])
      .addSelect(`sum(case when type = 'DEBIT' then total_money else 0 end)`, 'total')
      .addSelect(`sum(case when type = 'DEBIT' then total_money when  type = 'RETURN' then -refund_money else 0 end)`, 'real')
      .addSelect(`sum(case when type = 'RETURN' then refund_money else 0 end)`, 'return')
      .addSelect(`count(case when type = 'DEBIT' then 1 end)`, 'count')
      .leftJoin('Transaction.department', 'department')
      .where(queryString)
      .cache(3 * 3600)
      .groupBy('Transaction.department')
      .orderBy('Transaction.department', 'ASC');
    delete  filter['department']
    queryString = queryBuilderFunc('Transaction', filter);

    const queryBuilderExternal = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['department.code, department.name', 'department.id'])
      .addSelect(`sum(case when type = 'DEBIT' then total_money else 0 end)`, 'total')
      .addSelect(`sum(case when type = 'DEBIT' then total_money when  type = 'RETURN' then -refund_money else 0 end)`, 'real')
      .addSelect(`sum(case when type = 'RETURN' then refund_money else 0 end)`, 'return')
      .addSelect(`count(case when type = 'DEBIT' then 1 end)`, 'count')
      .leftJoin('Transaction.department', 'department')
      .where(queryString)
      .andWhere(`Transaction.department = ${JSON.parse(externalDepartment.externalChild)[0]} and Transaction.branch = 4`)
      .cache(3 * 3600)
      .groupBy('Transaction.department')
      .orderBy('Transaction.department', 'ASC');
    // const arr = await queryBuilder.getRawMany()
    // const arr2 = await queryBuilderExternal.getRawMany()
    // console.log(arr2)
    return [...await queryBuilder.getRawMany(),...await queryBuilderExternal.getRawMany()];
  }


  async getTop10Sale(filter = {}): Promise<any> {
    let queryString = queryBuilderFunc('Transaction', filter);

    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['user.code, user.firstName, user.lastName, user.id'])
      .select(['sale.code', 'sale.id', 'sale.firstName', 'sale.lastName'])
      .addSelect(`sum(case when type = 'DEBIT' then total_money when  type = 'RETURN' then -refund_money else 0 end)`, 'realMoney')
      .leftJoin('Transaction.sale', 'sale')
      .where(queryString)
      .groupBy('Transaction.saleId')
      .cache(3 * 3600)
      .orderBy('realMoney', 'DESC')
      .limit(10);
    return await queryBuilder.getRawMany();

    // queryString = queryBuilderFunc('StoreInput', filter);
    // const productIds = result.map(item => item.user_id);
    // const returnBuilder = await this.storeInputRepository
    //   .createQueryBuilder('StoreInput')
    //   .select(['saleId'])
    //   .addSelect('SUM(StoreInput.realMoney)', 'return')
    //   .where('saleId IN (:saleIds)', { saleIds: productIds.length > 0 ? productIds : '' })
    //   .andWhere(queryString)
    //   .andWhere(` StoreInput.status = 'APPROVED'`)
    //   .groupBy('StoreInput.saleId')
    //   .cache(3 * 3600)
    //   .getRawMany();
    // const finalArray = result.map(item => {
    //   const final = {
    //     ...item,
    //     return: 0
    //   };
    //   const founded = returnBuilder.filter(returnItem => returnItem.saleId === item.user_id);
    //   if (founded.length > 0) {
    //     final.return = founded[0].return;
    //   }
    //   return final;
    // });
  }


  async getIncomeChart(filter = {}): Promise<any> {
    // select sum(quantity), productId, p.code,p.name from order_details join product p on p.id = order_details.productId group by productId ORDER BY sum(quantity) DESC limit 10
    let queryString = queryBuilderFunc('Transaction', filter);

    const queryBuilder = await this.transactionRepository
      .createQueryBuilder('Transaction')
      .select('DATE(createdDate)','date')
      .addSelect(`sum(case when type = 'DEBIT' then total_money when  type = 'RETURN' then -refund_money else 0 end)`, 'sum')
      .andWhere(queryString)
      .cache(3 * 3600)
      .groupBy('DATE(Transaction.createdDate)')
      .getRawMany();
    return queryBuilder
  }

  async getDebtChart(filter = {}): Promise<any> {
    // select sum(quantity), productId, p.code,p.name from order_details join product p on p.id = order_details.productId group by productId ORDER BY sum(quantity) DESC limit 10
    let queryString = queryBuilderFunc('Transaction', filter);

    const queryBuilder = await this.transactionRepository
      .createQueryBuilder('Transaction')
      .select('DATE(createdDate)','date')
      .addSelect(`sum(case when type = 'DEBIT' then total_money else 0 end)`, 'sum')
      .andWhere(queryString)
      .cache(3 * 3600)
      .groupBy('DATE(Transaction.createdDate)')
      .getRawMany();
    return queryBuilder
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
    let queryString = queryBuilderFunc('Transaction', filter);
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['customer.code, customer.name, customer.id'])
      .addSelect(`sum(case when type = 'DEBIT' then total_money when  type = 'RETURN' then -refund_money else 0 end)`, 'sum')
      .leftJoin('Transaction.customer', 'customer')
      .where(queryString)
      .groupBy('Transaction.customerId')
      .cache(3 * 3600)
      .orderBy('sum', 'DESC')
      .limit(10);
    // .createQueryBuilder('Order')
    // .select(['customer.code, customer.name'])
    // .addSelect('Sum(Order.real_money)', 'sum')
    // .addSelect('Max(Order.customer)', 'customer')
    // .leftJoin('Order.customer', 'customer')
    // .where(queryString)
    // .andWhere(`Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
    // .cache(3 * 3600)
    // .groupBy('Order.customer, customer.code, customer.name')
    // .orderBy('sum(Order.real_money)', 'DESC')
    // .limit(10);
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
    let queryString = queryBuilderFunc('Transaction', filter);

    const queryBuilder = await this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['product.id, product.code, product.name'])
      .addSelect('sum(orderDetails.quantity)', 'sum')
      .leftJoin('Transaction.order', 'order')
      .leftJoin('order.orderDetails', 'orderDetails')
      .leftJoin('orderDetails.product', 'product')
      .andWhere(queryString)
      .cache(3 * 3600)
      .groupBy('orderDetails.productId')
      .orderBy('sum', 'DESC')
      .limit(10)
      .getRawMany();
    const productIds = queryBuilder.map(item => item.id);

    const returnProduct = await this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['storeInputDetails.productId'])
      .addSelect('sum(storeInputDetails.quantity)', 'sum')
      .leftJoin('Transaction.storeInput', 'storeInput')
      .leftJoin('storeInput.storeInputDetails', 'storeInputDetails')
      .andWhere(queryString)
      .andWhere('storeInputDetails.product IN (:saleIds)', { saleIds: productIds.length > 0 ? productIds : '' })
      .cache(3 * 3600)
      .groupBy('storeInputDetails.productId')
      .getRawMany();

    const final = queryBuilder.map(item => {
      const index = returnProduct.findIndex(product => product.productId === item.id);
      if (index >= 0) {
        return {
          ...item,
          sum: Number(item.sum) - Number(returnProduct[index].sum)
        };
      }
      return item;
    });
    return final;
  }

  //select c.code, c.contact_name, c.contact_name, sum(real_money) from `order` left join customer c on `order`.customerId = c.id where  customerId in (select id from customer where customer.saleId = 14) group by customerId order by sum(real_money) desc limit 10
  async getTop10BestCustomer(filter): Promise<any> {
    let queryString = queryBuilderFunc('Transaction', filter);
    // if (filter['saleId']) {
    //   const listCustomer = await this.customerRepository.find({
    //     where: {
    //       sale: filter['saleId']
    //     },
    //     cache: 3 * 3600
    //   });
    //   if (listCustomer.length > 0) {
    //     queryString += ` Order.customer IN ${JSON.stringify(listCustomer.map(item => item.id))
    //       .replace('[', '(')
    //       .replace(']', ')')}`;
    //   }
    // }

    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['customer.code, customer.name'])
      .addSelect(`sum(case when type = 'DEBIT' then total_money when  type = 'RETURN' then -refund_money else 0 end)`, 'sum')
      .leftJoin('Transaction.customer', 'customer')
      .where(queryString)
      .cache(3 * 3600)
      .groupBy('Transaction.customer,customer.code,customer.name')
      .orderBy('sum', 'DESC')
      .limit(10);
    return await queryBuilder.getRawMany();
  }

  async getSumProductQuantity(filter): Promise<any> {
    let queryString = queryBuilderFunc('Transaction', filter);
    queryString = queryString.replace('Transaction.productId', 'product.id');
    queryString = queryString.replace('Transaction.brandId', 'brand.id');
    queryString = queryString.replace('Transaction.productGroupId', 'productGroup.id');
    const queryBuilder = await this.transactionRepository.manager.connection
      .createQueryBuilder()
      .from(Transaction, 'Transaction')
      .addSelect('sum(orderDetails.quantity)', 'sum')
      .leftJoin('Transaction.order', 'order')
      .leftJoin('order.orderDetails', 'orderDetails')
      .leftJoin('orderDetails.product', 'product')
      .leftJoin('product.productBrand', 'brand')
      .leftJoin('product.productGroup', 'productGroup')
      .where(queryString)
      .cache(3 * 3600)
      .getRawOne();
    const returnProduct = await this.transactionRepository.manager.connection
      .createQueryBuilder()
      .from(Transaction, 'Transaction')
      .addSelect('sum(storeInputDetails.quantity)', 'sum')
      .leftJoin('Transaction.storeInput', 'storeInput')
      .leftJoin('storeInput.storeInputDetails', 'storeInputDetails')
      .leftJoin('storeInputDetails.product', 'product')
      .leftJoin('product.productBrand', 'brand')
      .leftJoin('product.productGroup', 'productGroup')
      .where(queryString)
      .cache(3 * 3600)
      .getRawOne();

    return { sum: queryBuilder.sum - returnProduct.sum };
  }

  async getSumIncomeForProductReport(filter): Promise<any> {
    let queryString = queryBuilderFunc('Transaction', filter);
    queryString = queryString.replace('Transaction.productId', 'product.id');
    queryString = queryString.replace('Transaction.brandId', 'brand.id');
    queryString = queryString.replace('Transaction.productGroupId', 'productGroup.id');
    const queryBuilder = await this.transactionRepository.manager.connection
      .createQueryBuilder()
      .from(Transaction, 'Transaction')
      .addSelect('sum(orderDetails.priceReal * orderDetails.quantity * (100 - orderDetails.reducePercent) / 100)', 'sum')
      .leftJoin('Transaction.order', 'order')
      .leftJoin('order.orderDetails', 'orderDetails')
      .leftJoin('orderDetails.product', 'product')
      .leftJoin('product.productBrand', 'brand')
      .leftJoin('product.productGroup', 'productGroup')
      .where(queryString)
      .andWhere(`Transaction.orderId is not null`)
      .cache(3 * 3600)
      .getRawOne();
    const returnProduct = await this.transactionRepository.manager.connection
      .createQueryBuilder()
      .from(Transaction, 'Transaction')
      .addSelect('sum(storeInputDetails.priceTotal)', 'sum')
      .leftJoin('Transaction.storeInput', 'storeInput')
      .leftJoin('storeInput.storeInputDetails', 'storeInputDetails')
      .leftJoin('storeInputDetails.product', 'product')
      .leftJoin('product.productBrand', 'brand')
      .leftJoin('product.productGroup', 'productGroup')
      .where(queryString)
      .andWhere(`Transaction.storeInputId is not null`)
      .cache(3 * 3600)
      .getRawOne();
    return { sum: queryBuilder.sum - returnProduct.sum };
  }

  async getProductReport(options, filter): Promise<any> {
    let queryString = queryBuilderFunc('Transaction', filter);
    queryString = queryString.replace('Transaction.productId', 'product.id');
    queryString = queryString.replace('Transaction.brandId', 'brand.id');
    queryString = queryString.replace('Transaction.productGroupId', 'productGroup.id');
    //order_details.price_real * quantity * (100 - reduce_percent) / 100
    const queryBuilder = await this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['product.name', 'product.id'])
      .addSelect(`sum(orderDetails.price_real * orderDetails.quantity * (100 - orderDetails.reduce_percent) / 100)`, 'total')
      .addSelect(`sum(orderDetails.quantity)`, 'count')
      .leftJoin('Transaction.order', 'order')
      .leftJoin('order.orderDetails', 'orderDetails')
      .leftJoin('orderDetails.product', 'product')
      .leftJoin('product.productBrand', 'brand')
      .leftJoin('product.productGroup', 'productGroup')
      .where(queryString)
      .andWhere(`orderDetails.orderId is not null`)
      .groupBy('orderDetails.productId')
      .orderBy('`total`', 'DESC')
      .offset(options.skip)
      .limit(options.take)
      .cache(3 * 3600)
      .getRawMany();

    const productIds = queryBuilder.map(item => item.product_id);

    const countBuilder = await this.transactionRepository.manager.connection
      .createQueryBuilder()
      .from(Transaction, 'Transaction')
      .select('count(*)', 'count')
      .leftJoin('Transaction.order', 'order')
      .leftJoin('order.orderDetails', 'orderDetails')
      .leftJoin('orderDetails.product', 'product')
      .leftJoin('product.productBrand', 'brand')
      .leftJoin('product.productGroup', 'productGroup')
      .where(queryString)
      .andWhere(`Transaction.orderId is not null`)
      .groupBy('orderDetails.productId')
      .cache(3 * 3600)
      .getRawOne();

    const returnProduct = await this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['product.name', 'product.id'])
      .addSelect('sum(storeInputDetails.priceTotal)', 'return')
      .addSelect('sum(storeInputDetails.quantity)', 'count')
      .leftJoin('Transaction.storeInput', 'storeInput')
      .leftJoin('storeInput.storeInputDetails', 'storeInputDetails')
      .leftJoin('storeInputDetails.product', 'product')
      .leftJoin('product.productBrand', 'brand')
      .leftJoin('product.productGroup', 'productGroup')
      .andWhere(queryString)
      .andWhere('storeInputDetails.product IN (:saleIds)', { saleIds: productIds.length > 0 ? productIds: JSON.parse(filter['product']).length > 0? JSON.parse(filter['product']): '' })
      .andWhere(`Transaction.storeInputId is not null`)
      .cache(3 * 3600)
      .groupBy('storeInputDetails.productId')
      .getRawMany();
    if(queryBuilder.length > 0){
      const final = queryBuilder.map(item => {
        const index = returnProduct.findIndex(product => product.productId === item.product_id);
        if (index >= 0) {
          return {
            ...item,
            count: Number(item.count) -  Number(returnProduct[index].count),
            return: Number(returnProduct[index].sum)
          };
        }
        return item;
      });
      return [final, Number(countBuilder?.count || 0)];
    }else {
      return [returnProduct, Number(returnProduct?.length || 0)];
    }

  }

  async getSaleSummary(filter): Promise<any> {
    let queryString = queryBuilderFunc('Transaction', filter);
    const queryBuilder = await this.transactionRepository.manager.connection
      .createQueryBuilder()
      .addSelect(`sum(case when type = 'DEBIT' then total_money else 0 end)`, 'total')
      .addSelect(`sum(case when type = 'DEBIT' then total_money when  type = 'RETURN' then -refund_money else 0 end)`, 'real')
      .where(queryString)
      .from(Transaction, 'Transaction')
      .cache(3 * 3600)
      .getRawOne();
    // const returnBuilder = await this.storeInputRepository.manager.connection
    //   .createQueryBuilder()
    //   .addSelect('SUM(StoreInput.realMoney)', 'return')
    //   .from(StoreInput, 'StoreInput')
    //   .where(queryString)
    //   .andWhere(`StoreInput.status = 'APPROVED' and StoreInput.type = 'RETURN'`)
    //   .cache(3 * 3600)
    //   .getRawOne();
    // queryBuilder.sum = queryBuilder.sum - returnBuilder.return;
    return queryBuilder;
  }

  async getSaleReport(options, filter): Promise<any> {
    let queryString = queryBuilderFunc('Transaction', filter);
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['sale.code', 'sale.id', 'sale.firstName', 'sale.lastName'])
      .addSelect(`sum(case when type = 'DEBIT' then total_money else 0 end)`, 'totalMoney')
      .addSelect(`sum(case when type = 'RETURN' then refund_money else 0 end)`, 'return')
      .addSelect(`sum(case when type = 'DEBIT' then total_money when  type = 'RETURN' then -refund_money else 0 end)`, 'realMoney')
      .leftJoin('Transaction.sale', 'sale')
      .where(queryString)
      .groupBy('Transaction.saleId')
      .orderBy(`realMoney`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .offset(options.skip)
      .limit(options.take)
      .cache(3 * 3600);
    const result = await queryBuilder.getRawMany();
    const count = await this.transactionRepository
      .createQueryBuilder('Transaction')
      .select('count(*)', 'count')
      .where(queryString)
      .groupBy('Transaction.saleId')
      .leftJoin('Transaction.sale', 'sale')
      .cache(3 * 3600)
      .getRawMany();

    return [result, count.length];
  }

  async getCustomerSummary(filter): Promise<any> {
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

  async getCustomerPriceSummary(filter): Promise<any> {
    let queryString = queryBuilderFunc('Transaction', filter);
    queryString = queryString.replace('Transaction.typeId', 'customer.typeId');
    const queryBuilder = this.orderRepository.manager.connection
      .createQueryBuilder()
      .from(Transaction, 'Transaction')
      .addSelect(`sum(case when type = 'DEBIT' then total_money when  type = 'RETURN' then -refund_money else 0 end)`, 'realMoney')
      .leftJoin('Transaction.customer', 'customer')
      .leftJoin('customer.type', 'type')
      .where(queryString)
      // .groupBy('Transaction.customerId')
      .cache(3 * 3600);
    return await queryBuilder.getRawOne();
  }

  async getCustomerReport(options, filter): Promise<any> {
    let queryString = queryBuilderFunc('Transaction', filter);
    queryString = queryString.replace('Transaction.typeId', 'customer.typeId');
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['customer.id', 'customer.code', 'customer.name','customer.address','customer.tel'])
      .addSelect(`sum(case when type = 'DEBIT' then total_money else 0 end)`, 'total')
      .addSelect(`sum(case when type = 'DEBIT' then total_money when  type = 'RETURN' then -refund_money else 0 end)`, 'real')
      .addSelect(`sum(case when type = 'RETURN' then refund_money else 0 end)`, 'return')
      .leftJoin('Transaction.customer', 'customer')
      .leftJoin('customer.type', 'type')
      .where(queryString)
      .groupBy('Transaction.customerId, customer.code, customer.name, customer.id ')
      .orderBy('`real`', 'DESC')
      .offset(options.skip)
      .limit(options.take)
      .cache(3 * 3600);
    const result = await queryBuilder.getRawMany();

    const count = await this.orderRepository
      .createQueryBuilder('Transaction')
      .select('count(*)', 'count')
      .where(queryString)
      .groupBy('Transaction.customerId')
      .leftJoin('Transaction.customer', 'customer')
      .leftJoin('customer.type', 'type')
      .leftJoin('Transaction.sale', 'sale')
      .cache(3 * 3600)
      .getRawMany();

    return [result, count.length];
  }

  async getPromotionPrice(filter): Promise<any> {
    let queryString = queryBuilderFunc('Transaction', filter);
    queryString = queryString.replace('Transaction.promotion', 'order.promotion');
    const queryBuilder = this.transactionRepository.manager.connection
      .createQueryBuilder()
      .from(Transaction, 'Transaction')
      .addSelect(
        `sum(case when type = 'DEBIT' then Transaction.total_money when  type = 'RETURN' then -Transaction.refund_money else 0 end)`,
        'sum'
      )
      .addSelect(`sum(case when type = 'DEBIT' then Transaction.total_money  else 0 end)`, 'total')
      .leftJoin('Transaction.order', 'order')
      .where(queryString)
      .cache(3 * 3600);
    return await queryBuilder.getRawOne();
  }

  //select count(*) from (select customerId from `order` group by customerId) as totals
  async getPromotionCustomer(filter): Promise<any> {
    let queryString = queryBuilderFunc('Order', filter);
    // queryString = queryString.replace('Transaction.promotion', 'order.promotion');

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
    let queryString = queryBuilderFunc('Transaction', filter);
    queryString = queryString.replace('Transaction.promotion', 'order.promotion');
    queryString = queryString.replace('Transaction.promotionItem', 'order.promotionItem');
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['customer.id', 'customer.code', 'customer.name'])
      .addSelect(`sum(case when Transaction.type = 'DEBIT' then Transaction.total_money else 0 end)`, 'totalMoney')
      .addSelect(
        `sum(case when Transaction.type = 'DEBIT' then Transaction.total_money when  Transaction.type = 'RETURN' then -Transaction.refund_money else 0 end)`,
        'realMoney'
      )
      .addSelect(`sum(case when Transaction.type = 'RETURN' then Transaction.refund_money else 0 end)`, 'return')
      .leftJoin('Transaction.customer', 'customer')
      .leftJoin('Transaction.sale', 'sale')
      .leftJoin('Transaction.order', 'order')
      .leftJoin('order.promotion', 'promotion')
      .leftJoin('order.promotionItem', 'promotionItem')
      .where(queryString)
      .groupBy('Transaction.customerId, customer.id, customer.code, customer.name')
      .orderBy(`realMoney`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .offset(options.skip)
      .limit(options.take)
      .cache(3 * 3600);
    const count = await this.transactionRepository
      .createQueryBuilder('Transaction')
      .select('count(*)', 'count')
      .where(queryString)
      .groupBy('Transaction.customerId')
      .leftJoin('Transaction.customer', 'customer')
      .leftJoin('Transaction.sale', 'sale')
      .leftJoin('Transaction.order', 'order')
      .leftJoin('order.promotion', 'promotion')
      .leftJoin('order.promotionItem', 'promotionItem')
      .cache(3 * 3600)
      .getRawMany();
    const result = await queryBuilder.getRawMany();

    return [result, count.length];
  }

  async getCustomerCount(filter): Promise<any> {
    let queryString = queryBuilderFunc('Customer', filter);
    // queryString = queryString.replace('Transaction.promotion', 'order.promotion');
    const count = await this.customerRepository
      .createQueryBuilder('Customer')
      .select('count(*)', 'count')
      .where(queryString)
      .cache(3 * 3600)
      .getRawOne();
    // const queryBuilder = this.customerRepository.manager.connection
    //   .createQueryBuilder()
    //   .select('count(*)', 'count')
    //   .from(qb => {
    //     return qb
    //       .select('Order.customerId')
    //       .from(Order, 'Order')
    //       .where(queryString)
    //       .andWhere(` Order.status NOT IN ('WAITING','APPROVED','CANCEL','DELETED','CREATED')`)
    //       .groupBy('Order.customerId');
    //   }, 'totals');
    return await count;
  }
}
