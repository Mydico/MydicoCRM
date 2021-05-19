import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageRequest } from '../domain/base/pagination.entity';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import Order from '../domain/order.entity';
import { OrderRepository } from '../repository/order.repository';
import { Request, Response } from 'express';
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
import { User } from '../domain/user.entity';
import { DepartmentService } from './department.service';
import { IncomeDashboardService } from './income-dashboard.service';
import IncomeDashboard from '../domain/income-dashboard.entity';
import { DashboardType } from '../domain/enumeration/dashboard-type';

const relationshipNames = [];
relationshipNames.push('customer');
relationshipNames.push('customer.sale');
relationshipNames.push('orderDetails');
relationshipNames.push('orderDetails.product');
relationshipNames.push('promotion');
relationshipNames.push('store');

@Injectable()
export class OrderService {
  logger = new Logger('OrderService');

  constructor(
    @InjectRepository(OrderRepository) private orderRepository: OrderRepository,
    private readonly billService: BillService,
    private readonly productQuantityService: ProductQuantityService,
    private readonly transactionService: TransactionService,
    private readonly departmentService: DepartmentService,
    private readonly incomeDashboardService: IncomeDashboardService
  ) { }

  async findById(id: string): Promise<Order | undefined> {
    const options = { relations: relationshipNames };
    return await this.orderRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Order>): Promise<Order | undefined> {
    return await this.orderRepository.findOne(options);
  }

  async findAndCount(pageRequest: PageRequest, req: Request, currentUser: User): Promise<[Order[], number]> {
    let departmentVisible = [];
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible.push(currentUser.department);
    }
    let queryString = "Order.status <> 'DELETED'";
    Object.keys(req.query).forEach((item, index) => {
      if (item !== 'page' && item !== 'size' && item !== 'sort') {
        queryString += `Order.${item} like '%${req.query[item]}%' ${Object.keys(req.query).length - 1 === index ? '' : 'OR '}`;
      }
    });
    if (departmentVisible.length > 0) {
      queryString += ` AND Order.department IN ${JSON.stringify(departmentVisible.map(item => item.id))
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    return await this.orderRepository
      .createQueryBuilder('Order')
      .leftJoinAndSelect('Order.customer', 'customer')
      .leftJoinAndSelect('Order.promotion', 'promotion')
      .leftJoinAndSelect('promotion.customerType', 'customerType')
      .leftJoinAndSelect('Order.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.product', 'product')
      .where(queryString)
      .orderBy('Order.createdDate', 'DESC')
      .skip(pageRequest.page * pageRequest.size)
      .take(pageRequest.size)
      .getManyAndCount();
    // return await this.orderRepository.findAndCount(options);
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

  async save(order: Order): Promise<Order | undefined> {
    const count = await this.orderRepository
      .createQueryBuilder('order')
      .select('DISTINCT()')
      .getCount();
    if (!order.id) {
      order.code = `${count + 1}`;
    }
    return await this.orderRepository.save(order);
  }

  async update(order: Order): Promise<Order> {
    if (order.status === OrderStatus.CREATE_COD) {
      const foundedOrder = await this.findById(order.id);
      const canCreateBill = await this.exportStore(foundedOrder);
      if (canCreateBill) {
        const bill = new Bill();
        bill.code = `VD-${order.code}`;
        bill.customer = order.customer;
        bill.order = order;
        bill.store = order.store;
        bill.createdBy = order.lastModifiedBy;
        const createdBill = await this.billService.save(bill);
        const latestTransaction = await this.transactionService.findByfields({
          where: { customer: foundedOrder.customer },
          order: { createdDate: 'DESC' }
        });
        const transaction = new Transaction();
        transaction.customer = foundedOrder.customer;
        transaction.order = order;
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
        incomeItem.type = DashboardType.ORDER;
        incomeItem.userId = foundedOrder.customer.sale?.id || null;
        await this.incomeDashboardService.save(incomeItem);
      }
    }
    return await this.save(order);
  }

  async delete(order: Order): Promise<Order | undefined> {
    return await this.orderRepository.remove(order);
  }
}
