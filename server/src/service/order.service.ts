import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindManyOptions, FindOneOptions, In } from 'typeorm';
import Order from '../domain/order.entity';
import { OrderRepository } from '../repository/order.repository';
import { BillService } from './bill.service';
import Bill from '../domain/bill.entity';
import { OrderStatus } from '../domain/enumeration/order-status';
import { ProductQuantityService } from './product-quantity.service';
import Store from '../domain/store.entity';
import ProductQuantity from '../domain/product-quantity.entity';
import _ from 'lodash';
import { TransactionService } from './transaction.service';
import Transaction from '../domain/transaction.entity';
import { TransactionType } from '../domain/enumeration/transaction-type';
import { IncomeDashboardService } from './income-dashboard.service';
import IncomeDashboard from '../domain/income-dashboard.entity';
import { DashboardType } from '../domain/enumeration/dashboard-type';
import { CustomerService } from './customer.service';
import { User } from '../domain/user.entity';

const relationshipNames = [];
relationshipNames.push('customer');
relationshipNames.push('orderDetails');
relationshipNames.push('orderDetails.product');
relationshipNames.push('promotion');
relationshipNames.push('promotion.customerType');
relationshipNames.push('store');
relationshipNames.push('sale');
relationshipNames.push('department');
relationshipNames.push('branch');

@Injectable()
export class OrderService {
  logger = new Logger('OrderService');

  constructor(
    @InjectRepository(OrderRepository) private orderRepository: OrderRepository,
    @Inject(forwardRef(() => BillService))
    private readonly billService: BillService,
    private readonly productQuantityService: ProductQuantityService,
    private readonly transactionService: TransactionService,
    private readonly incomeDashboardService: IncomeDashboardService
  ) { }

  async findById(id: string): Promise<Order | undefined> {
    if (!relationshipNames.includes('customer.department') && !relationshipNames.includes('customer.type')) {
      relationshipNames.push('customer.department');
      relationshipNames.push('customer.type');
    }
    const options = { relations: relationshipNames };

    return await this.orderRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Order>): Promise<Order | undefined> {
    return await this.orderRepository.findOne(options);
  }

  async findAndCount(
    options: FindManyOptions<Order>,
    filter = {},
    departmentVisible = [],
    isEmployee: boolean,
    currentUser: User
  ): Promise<[Order[], number]> {
    let queryString = '';
    Object.keys(filter).forEach((item, index) => {
      if (item === 'endDate' || item === 'startDate') return;
      queryString += `Order.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'OR '}`;
    });
    let andQueryString = '';

    if (departmentVisible.length > 0) {
      andQueryString += ` ${andQueryString.length === 0 ? "" : " AND "} Order.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (filter['endDate'] && filter['startDate']) {
      andQueryString += ` ${andQueryString.length === 0 ? "" : " AND "}  Order.createdDate  >= '${filter['startDate']}' AND  Order.createdDate <= '${filter['endDate']} 24:00:00'`;
    }
    if (isEmployee) {
      andQueryString += ` ${andQueryString.length === 0 ? "" : " AND "}  Order.sale = ${currentUser.id}`;
    }
    if (currentUser.branch) {
      if (!currentUser.branch.seeAll) {
        andQueryString += ` ${andQueryString.length === 0 ? "" : " AND "}  Order.branch = ${currentUser.branch.id}`;
      }
    } else {
      andQueryString += ` ${andQueryString.length === 0 ? "" : " AND "} Order.branch is NULL `;
    }
    const cacheKeyBuilder = `get_orders_department_${departmentVisible.join(',')}_branch_${currentUser.branch ? (!currentUser.branch.seeAll ? currentUser.branch.id : -1) : null
      }_sale_${isEmployee ? currentUser.id : -1}_filter_${JSON.stringify(filter)}_skip_${options.skip}_${options.take}_Order.${Object.keys(
        options.order
      )[0] || 'createdDate'}_${options.order[Object.keys(options.order)[0]] || 'DESC'}`;
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .leftJoinAndSelect('Order.customer', 'customer')
      .leftJoinAndSelect('Order.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.product', 'product')
      .leftJoinAndSelect('Order.promotion', 'promotion')
      .leftJoinAndSelect('promotion.customerType', 'customerType')
      .leftJoinAndSelect('Order.store', 'store')
      .leftJoinAndSelect('Order.sale', 'sale')
      .leftJoinAndSelect('Order.department', 'department')
      .cache(cacheKeyBuilder, 604800)
      .where(andQueryString)
      .orderBy(`Order.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take);

    const count = this.orderRepository
      .createQueryBuilder('Order')
      .where(andQueryString)
      .orderBy(`Order.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take)
      .cache(
        `cache_count_get_orders_department_${JSON.stringify(departmentVisible)}_branch_${currentUser.branch ? (!currentUser.branch.seeAll ? currentUser.branch.id : -1) : null
        }_sale_${isEmployee ? currentUser.id : -1}_filter_${JSON.stringify(filter)}`
      );
    if (queryString) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          sqb.where(queryString);
        })
      );
      count.andWhere(
        new Brackets(sqb => {
          sqb.where(queryString);
        })
      );
    }

    const result = await queryBuilder.getManyAndCount();
    result[1] = await count.getCount();
    return result;
  }

  async getProductInStore(arrIds: string[], store: Store): Promise<ProductQuantity[]> {
    return await this.productQuantityService.findByfields({
      where: {
        product: In(arrIds),
        store
      }
    });
  }

  async canExportStore(order: Order): Promise<boolean> {
    const foundedOrder = await this.findById(order.id);
    const merged = foundedOrder.orderDetails.reduce((previousValue, currentValue) => {
      const sum = previousValue.find(e => e.product.id === currentValue.product.id);
      if (!sum) {
        previousValue.push(Object.assign({}, currentValue));
      } else {
        sum.quantity += currentValue.quantity;
      }
      return previousValue;
    }, []);
    const arrIds = merged.map(item => item.product.id);
    const foundedProductInStore = await this.getProductInStore([...new Set(arrIds)], foundedOrder.store);
    if (foundedProductInStore.length == 0) {
      return false;
    }
    let canCreateBill = true;
    merged.forEach(item => {
      const founded = foundedProductInStore.filter(store => store.product.id === item.product.id);
      if (founded.length > 0) {
        if (founded[0].quantity < item.quantity) {
          canCreateBill = false;
          return;
        }
      }
    });
    return canCreateBill;
  }

  async exportStore(order: Order): Promise<boolean> {
    const merged = order.orderDetails.reduce((previousValue, currentValue) => {
      const sum = previousValue.find(e => e.product.id === currentValue.product.id);
      if (!sum) {
        previousValue.push(Object.assign({}, currentValue));
      } else {
        sum.quantity += currentValue.quantity;
      }
      return previousValue;
    }, []);
    const arrIds = merged.map(item => item.product.id);
    const foundedProductInStore = await this.getProductInStore(arrIds, order.store);
    const productQuantityExported = foundedProductInStore.map(item => {
      const itemFounded = merged.filter(origin => origin.product.id === item.product.id);
      return {
        ...item,
        quantity: item.quantity - itemFounded[0].quantity
      };
    });
    const checkExistInStore = productQuantityExported.filter(item => item.quantity < 0);
    if (checkExistInStore.length > 0) {
      return false;
    } else {
      await this.productQuantityService.saveMany(productQuantityExported);
      return true;
    }
  }

  async save(order: Order, departmentVisible = [], isEmployee: boolean, currentUser: User): Promise<Order | undefined> {
    const cacheKeyBuilder = `get_orders_department_${departmentVisible.join(',')}_sale_${isEmployee ? currentUser.id : -1}`;

    await this.orderRepository.removeCache([cacheKeyBuilder, 'Order']);

    const count = await this.orderRepository
      .createQueryBuilder('order')
      .select('DISTINCT()')
      .where(`order.code like '%${currentUser.mainDepartment ? currentUser.mainDepartment.code : currentUser.department.code}%'`)
      .getCount();
    if (!order.id) {
      order.code = `${currentUser.mainDepartment ? currentUser.mainDepartment.code : currentUser.department.code}-${count + 1}`;
    }
    return await this.orderRepository.save(order);
  }

  async updateStatus(order: Order): Promise<Order | undefined> {
    return await this.orderRepository.save(order);
  }

  async update(order: Order, departmentVisible = [], isEmployee: boolean, currentUser: User): Promise<Order> {
    const foundedOrder = await this.findById(order.id);

    if (foundedOrder.status === OrderStatus.CREATE_COD && order.status === OrderStatus.CREATE_COD) {
      throw new HttpException('Đơn hàng đã tạo vận đơn', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (order.status === OrderStatus.CREATE_COD) {
      const canCreateBill = await this.exportStore(foundedOrder);
      if (canCreateBill) {
        const bill = new Bill();
        bill.code = `VD-${foundedOrder.code}`;
        bill.customer = foundedOrder.customer;
        bill.order = foundedOrder;
        bill.store = foundedOrder.store;
        bill.customerName = foundedOrder.customer.name;
        bill.department = foundedOrder.department;
        bill.createdBy = foundedOrder.createdBy;
        const createdBill = await this.billService.save(bill);
        const latestTransaction = await this.transactionService.findByfields({
          where: { customer: foundedOrder.customer },
          order: { createdDate: 'DESC' }
        });
        const transaction = new Transaction();
        transaction.customer = foundedOrder.customer;
        transaction.customerCode = foundedOrder.customer.code;
        transaction.customerName = foundedOrder.customer.name;
        transaction.sale = foundedOrder.sale;
        transaction.saleName = foundedOrder.sale.code;
        transaction.branch = foundedOrder.branch;
        transaction.department = foundedOrder.department;
        transaction.order = foundedOrder;
        transaction.bill = createdBill;
        transaction.totalMoney = foundedOrder.realMoney;
        transaction.type = TransactionType.DEBIT;
        transaction.previousDebt = latestTransaction ? latestTransaction.earlyDebt : 0;
        transaction.earlyDebt = latestTransaction
          ? Number(latestTransaction.earlyDebt) + Number(foundedOrder.realMoney)
          : Number(foundedOrder.realMoney);
        await this.transactionService.save(transaction);
        const incomeItem = new IncomeDashboard();
        incomeItem.amount = foundedOrder.realMoney;
        incomeItem.departmentId = foundedOrder.department.id;
        incomeItem.type = DashboardType.ORDER;
        incomeItem.userId = foundedOrder.sale.id || null;
        await this.incomeDashboardService.save(incomeItem);
      }
    }
    return await this.save(order, departmentVisible, isEmployee, currentUser);
  }

  async delete(order: Order): Promise<Order | undefined> {
    return await this.orderRepository.remove(order);
  }
}
