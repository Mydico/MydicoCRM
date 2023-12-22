import { CACHE_MANAGER, forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Cache from 'cache-manager';
import { Brackets, FindManyOptions, FindOneOptions, In } from 'typeorm';
import Bill from '../domain/bill.entity';
import { OrderStatus } from '../domain/enumeration/order-status';
import { TransactionType } from '../domain/enumeration/transaction-type';
import Notification from '../domain/notification.entity';
import Order from '../domain/order.entity';
import ProductQuantity from '../domain/product-quantity.entity';
import Store from '../domain/store.entity';
import Transaction from '../domain/transaction.entity';
import { User } from '../domain/user.entity';
import { EventsGateway } from '../module/provider/events.gateway';
import { OrderRepository } from '../repository/order.repository';
import { BillService } from './bill.service';
import { CustomerService } from './customer.service';
import { DepartmentService } from './department.service';
import { FirebaseService } from './firebase.services';
import { NotificationService } from './notification.service';
import { ProductQuantityService } from './product-quantity.service';
import { TransactionService } from './transaction.service';
import { UserService } from './user.service';

const relationshipNames = [];
relationshipNames.push('customer');
relationshipNames.push('orderDetails');
relationshipNames.push('orderDetails.product');
relationshipNames.push('promotion');
relationshipNames.push('promotion.promotionItems');
relationshipNames.push('promotionItem');
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
    private readonly departmentService: DepartmentService,
    private readonly notificationService: NotificationService,
    private readonly firebaseService: FirebaseService,
    private readonly eventsGateway: EventsGateway,
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async findById(id: string): Promise<Order | undefined> {
    const cacheKey = `orderId-${id}`
    const cachedQuery = await this.cacheManager.get(cacheKey);
    if (cachedQuery) {
      return cachedQuery;
    }

    if (!relationshipNames.includes('customer.department') && !relationshipNames.includes('customer.type')) {
      relationshipNames.push('customer.department');
      relationshipNames.push('customer.type');
    }
    const options = { relations: relationshipNames, cache: true };
    const result = await this.orderRepository.findOne(id, options);
    result.orderDetails = result.orderDetails.sort((a, b) => {
      return Number(a.id) - Number(b.id);
    });
    await this.cacheManager.set(cacheKey, result, { ttl: 60 * 60 * 1000 });

    return result;
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
    // const cacheKeyBuilder = generateCacheKey(departmentVisible, currentUser, isEmployee, filter, options, 'order');

    let andQueryString = '';
    let queryString = '';
    const paramsObject: any = {}
    if (departmentVisible.length > 0) {
      andQueryString += ` ${andQueryString.length === 0 ? '' : ' AND '} Order.department IN (:...departments)`;
    }
    paramsObject.departments = departmentVisible

    if (filter['endDate'] && filter['startDate']) {
      andQueryString += ` ${andQueryString.length === 0 ? '' : ' AND '}  Order.createdDate  >= :startDate AND  Order.createdDate <= :endDate`;
    }
    paramsObject.startDate = filter['startDate'],
      paramsObject.endDate = filter['endDate'] + ' 23:59:59',
      delete filter['startDate'];
    delete filter['endDate'];

    if (isEmployee) {
      andQueryString += ` ${andQueryString.length === 0 ? '' : ' AND '}  Order.sale = :saleId`;
    }
    paramsObject.saleId = currentUser.id
    if (currentUser.branch) {
      if (!currentUser.branch.seeAll) {
        andQueryString += ` ${andQueryString.length === 0 ? '' : ' AND '}  Order.branch = :branch`;
        paramsObject.branch = currentUser.branch.id
      }
    } else {
      andQueryString += ` ${andQueryString.length === 0 ? '' : ' AND '} Order.branch is NULL `;
    }
    if (!filter['status']) {
      andQueryString += ` AND Order.status <> 'DELETED'`;
    }
    const queryBuilder = this.orderRepository
      .createQueryBuilder('Order')
      .leftJoinAndSelect('Order.customer', 'customer')
      .leftJoinAndSelect('Order.orderDetails', 'orderDetails')
      // .addSelect('SUM(orderDetails.quantity)', 'totalQuantity') // Summing the quantity
      .skip(options.skip)
      .take(options.take)
      .where(andQueryString, paramsObject)
      // .groupBy('Order.id') // Group by Order ID if you want the sum per order
      .orderBy({
        'Order.createdDate': options.order[Object.keys(options.order)[0]] || 'DESC'
      });

    // const count = this.orderRepository
    //   .createQueryBuilder('Order')
    //   // .leftJoinAndSelect('Order.customer', 'customer')
    //   // .leftJoinAndSelect('Order.orderDetails', 'orderDetails')
    //   // .leftJoinAndSelect('orderDetails.product', 'product')
    //   // .leftJoinAndSelect('Order.promotion', 'promotion')
    //   // .leftJoinAndSelect('promotion.customerType', 'customerType')
    //   // .leftJoinAndSelect('Order.sale', 'sale')
    //   // .leftJoinAndSelect('Order.department', 'department')
    //   .where(andQueryString,paramsObject)
    // // .cache(
    // //   `cache_count_get_orders_department_${JSON.stringify(departmentVisible)}_branch_${
    // //     currentUser.branch ? (!currentUser.branch.seeAll ? currentUser.branch.id : -1) : null
    // //   }_sale_${isEmployee ? currentUser.id : -1}_filter_${JSON.stringify(filter)}`
    // // );
    if (Object.keys(filter).length > 0) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          Object.keys(filter).forEach((item, index) => {
            sqb.andWhere(
              `Order.${item} ${item === 'saleId' || item == 'status' ? '=' : 'like'}  ${item === 'saleId' || item == 'status' ? "'" + filter[item] + "'" : "'%" + filter[item] + "%'"
              }`
            );
            // queryString += ` AND Order.${item} ${item === 'saleId' ? '=' : 'like'}  ${
            //   item === 'saleId' ? filter[item] : "'%" + filter[item] + "%'"
            // }`;
            // if (item == 'status') {
            //   sqb.andWhere(
            //     `Order.status = ${filter['status']}`
            //   );
            // }
          });
        })
      );
      // count.andWhere(
      //   new Brackets(sqb => {
      //     Object.keys(filter).forEach((item, index) => {
      //       sqb.andWhere(
      //         `Order.${item} ${item === 'saleId' || item == 'status' ? '=' : 'like'}  ${item === 'saleId' || item == 'status' ? "'" + filter[item] + "'" : "'%" + filter[item] + "%'"
      //         }`
      //       );
      //       // queryString += ` AND Order.${item} ${item === 'saleId' ? '=' : 'like'}  ${
      //       //   item === 'saleId' ? filter[item] : "'%" + filter[item] + "%'"
      //       // }`;
      //       // if (item == 'status') {
      //       //   sqb.andWhere(`Order.status = ${filter['status']}`);
      //       // }
      //     });
      //     // sqb.where(queryString);
      //   })
      // );
    }
    const cacheKey = queryBuilder.getQueryAndParameters().toString() + JSON.stringify(options);
    const cachedQuery = await this.cacheManager.get(cacheKey);
    if (cachedQuery) {
      return cachedQuery;
    }

    const result = await queryBuilder.getManyAndCount();
    await this.cacheManager.set(cacheKey, result, { ttl: 60 * 60 * 1000 });

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
    for (let index = 0; index < merged.length; index++) {
      const item = merged[index];
      const founded = foundedProductInStore.filter(store => store.product.id === item.product.id);
      if (founded.length > 0) {
        if (founded[0].quantity < item.quantity) {
          canCreateBill = false;
          return;
        }
      }
    }
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
        quantity: item.quantity - itemFounded[0].quantity,
        entity: 'ORDER',
        entityId: order.id,
        entityCode: order.code,
        destId: order.customer?.id,
        destName: order.customer.name,
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

  async emitMessage(result: Order, order: Order): Promise<void> {
    const ancestor = await this.departmentService.findAncestor(order.department);
    await this.eventsGateway.emitMessage({ ...result, departmentVisible: ancestor.map(item => item.id) });
  }

  async save(order: Order, currentUser: User): Promise<Order | undefined> {
    const customer = await this.customerService.findById(order.customer.id)
    if (customer.sale.id !== currentUser.id) {
      throw new HttpException('Khách hàng này không thuộc bạn quản lý.', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (!order.id) {
      const count = await this.orderRepository
        .createQueryBuilder('order')
        .select('DISTINCT()')
        .where(`order.code like '%${currentUser.mainDepartment ? currentUser.mainDepartment.code : currentUser.department.code}%'`)
        .getCount();
      order.code = `${currentUser.mainDepartment ? currentUser.mainDepartment.code : currentUser.department.code}-${count + 1}`;
      order.realMoney = order.orderDetails.reduce(
        (sum, current) => sum + (current.priceReal * current.quantity - (current.priceReal * current.quantity * current.reducePercent) / 100),
        0
      );
      order.reduceMoney = order.orderDetails.reduce(
        (sum, current) => sum + (current.priceReal * current.quantity * current.reducePercent) / 100,
        0
      );
      order.totalMoney = order.orderDetails.reduce((sum, current) => sum + current.priceReal * current.quantity, 0);
    }
    const result = await this.orderRepository.save(order);
    const userCanApproveOrder = await this.userService.findManager(result.department.id, currentUser.branch.id);
    const saveNotiArr: Notification[] = [];
    const pushNotiArr = [];

    for (let index = 0; index < userCanApproveOrder.length; index++) {
      const element = userCanApproveOrder[index];
      saveNotiArr.push({
        content: `Đơn hàng ${result.code} đã được tạo. Vui lòng kiểm tra`,
        type: 'ORDER',
        entityId: result.id,
        user: element
      }
      );
      if (element.fcmToken) {
        pushNotiArr.push({
          token: element.fcmToken,
          title: 'Thông báo',
          message: `Đơn hàng ${result.code} đã được tạo. Vui lòng kiểm tra`,
          data: {
            type: 'ORDER',
            entityId: result.id
          }
        });
      }

    }
    await this.notificationService.saveMany(saveNotiArr);
    await this.firebaseService.sendFirebaseMessages(pushNotiArr, false);
    await this.emitMessage(result, order);
    return result;
  }

  async updateStatus(order: Order): Promise<Order | undefined> {
    return await this.orderRepository.save(order);
  }

  async createCOD(order: Order): Promise<Order> {
    const foundedOrder = await this.findById(order.id);
    order.status = OrderStatus.CREATE_COD;
    order.billDate = new Date();
    if (foundedOrder.status === OrderStatus.CREATE_COD && order.status === OrderStatus.CREATE_COD) {
      throw new HttpException('Đơn hàng đã tạo vận đơn', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (order.status === OrderStatus.CREATE_COD) {
      const exist = await this.billService.findByfields({
        where: {
          order: order
        }
      });
      if (!exist) {
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
        } else {
          throw new HttpException('Đon hàng không thể tạo vận đơn.Số lượng sản phẩm trong kho không đủ', HttpStatus.UNPROCESSABLE_ENTITY);
        }
      } else {
        throw new HttpException('Vận đơn đã tồn tại', HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
    let result = await this.orderRepository.save(order);
    if (result.status != OrderStatus.CREATE_COD) {
      result.status = OrderStatus.CREATE_COD;
      result = await this.orderRepository.save(result);
    }
    await this.emitMessage(result, order);
    await this.notificationService.save({
      content: `Đơn hàng ${foundedOrder.code} đã được tạo vận đơn`,
      type: 'ORDER',
      entityId: foundedOrder.id,
      user: foundedOrder.sale
    });
    await this.firebaseService.sendFirebaseMessages(
      [
        {
          token: foundedOrder.sale.fcmToken,
          title: 'Thông báo',
          message: `Đơn hàng ${foundedOrder.code} đã được tạo vận đơn`,
          data: {
            type: 'ORDER',
            entityId: foundedOrder.id
          }
        }
      ],
      false
    );
    return result;
  }

  async update(order: Order): Promise<Order> {
    const exist = await this.billService.findByfields({
      where: {
        order: order
      }
    });
    if (exist) {
      throw new HttpException('Đơn hàng đã tạo vận đơn. Không thể chỉnh sửa', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    // const foundedOrder = await this.findById(order.id);

    // if (foundedOrder.status === OrderStatus.CREATE_COD && order.status === OrderStatus.CREATE_COD) {
    //   throw new HttpException('Đơn hàng đã tạo vận đơn', HttpStatus.UNPROCESSABLE_ENTITY);
    // }
    // if (order.status === OrderStatus.CREATE_COD) {
    //   const exist = await this.billService.findByfields({
    //     where: {
    //       order: order
    //     }
    //   });
    //   if (!exist) {
    //     const canCreateBill = await this.exportStore(foundedOrder);
    //     if (canCreateBill) {
    //       const bill = new Bill();
    //       bill.code = `VD-${foundedOrder.code}`;
    //       bill.customer = foundedOrder.customer;
    //       bill.order = foundedOrder;
    //       bill.store = foundedOrder.store;
    //       bill.customerName = foundedOrder.customer.name;
    //       bill.department = foundedOrder.department;
    //       bill.createdBy = foundedOrder.createdBy;
    //       const createdBill = await this.billService.save(bill);
    //       const latestTransaction = await this.transactionService.findByfields({
    //         where: { customer: foundedOrder.customer },
    //         order: { createdDate: 'DESC' }
    //       });
    //       const transaction = new Transaction();
    //       transaction.customer = foundedOrder.customer;
    //       transaction.customerCode = foundedOrder.customer.code;
    //       transaction.customerName = foundedOrder.customer.name;
    //       transaction.sale = foundedOrder.sale;
    //       transaction.saleName = foundedOrder.sale.code;
    //       transaction.branch = foundedOrder.branch;
    //       transaction.department = foundedOrder.department;
    //       transaction.order = foundedOrder;
    //       transaction.bill = createdBill;
    //       transaction.totalMoney = foundedOrder.realMoney;
    //       transaction.type = TransactionType.DEBIT;
    //       transaction.previousDebt = latestTransaction ? latestTransaction.earlyDebt : 0;
    //       transaction.earlyDebt = latestTransaction
    //         ? Number(latestTransaction.earlyDebt) + Number(foundedOrder.realMoney)
    //         : Number(foundedOrder.realMoney);
    //       await this.transactionService.save(transaction);
    //       // const incomeItem = new IncomeDashboard();
    //       // incomeItem.amount = foundedOrder.realMoney;
    //       // incomeItem.departmentId = foundedOrder.department.id;
    //       // incomeItem.branchId = foundedOrder.branch.id;
    //       // incomeItem.type = DashboardType.ORDER;
    //       // incomeItem.saleId = foundedOrder.sale.id || null;
    //       // await this.incomeDashboardService.save(incomeItem);
    //     } else {
    //       throw new HttpException('Đon hàng không thể tạo vận đơn.Số lượng sản phẩm trong kho không đủ', HttpStatus.UNPROCESSABLE_ENTITY);
    //     }
    //   } else {
    //     throw new HttpException('Vận đơn đã tồn tại', HttpStatus.UNPROCESSABLE_ENTITY);
    //   }
    // }
    const result = await this.orderRepository.save(order);
    const foundedOrder = await this.findById(order.id);

    let content = '';
    switch (order.status) {
      case OrderStatus.APPROVED:
        content = `Đơn hàng ${foundedOrder.code} đã được duyệt`;
        break;
      case OrderStatus.CANCEL:
        content = `Đơn hàng ${foundedOrder.code} đã bị hủy`;
        break;
      case OrderStatus.COD_APPROVED:
        content = `Vận đơn của đơn hàng ${foundedOrder.code} đã được duyệt`;
        break;
      case OrderStatus.SHIPPING:
        content = `Đơn hàng ${foundedOrder.code} đang được vận chuyển`;
        break;
      case OrderStatus.REJECTED:
        content = `Đơn hàng ${foundedOrder.code} đã bị từ chối`;
        break;
      case OrderStatus.WAITING:
        content = `Đơn hàng ${foundedOrder.code} đang chờ duyệt`;
        break;

      default:
        break;
    }

    await this.notificationService.save({
      content,
      type: 'ORDER',
      entityId: foundedOrder.id,
      user: foundedOrder.sale
    });
    await this.firebaseService.sendFirebaseMessages(
      [
        {
          token: foundedOrder.sale.fcmToken,
          title: 'Thông báo',
          message: content,
          data: {
            type: 'ORDER',
            entityId: foundedOrder.id
          }
        }
      ],
      false
    );
    return result;
  }

  async delete(order: Order): Promise<Order | undefined> {
    return await this.orderRepository.remove(order);
  }
}
