import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindManyOptions, FindOneOptions } from 'typeorm';
import Bill from '../domain/bill.entity';
import { BillRepository } from '../repository/bill.repository';
import { Request, Response } from 'express';
import { PageRequest } from '../domain/base/pagination.entity';
import { BillStatus } from '../domain/enumeration/bill-status';
import { User } from '../domain/user.entity';
import { DepartmentService } from './department.service';
import { OrderService } from './order.service';
import { OrderStatus } from '../domain/enumeration/order-status';
import { FirebaseService } from './firebase.services';
import { NotificationService } from './notification.service';

const relationshipNames = [];
relationshipNames.push('customer');
relationshipNames.push('transporter');
relationshipNames.push('order');
relationshipNames.push('order.sale');
relationshipNames.push('store');

@Injectable()
export class BillService {
  logger = new Logger('BillService');

  constructor(
    @InjectRepository(BillRepository) private billRepository: BillRepository,
    private readonly departmentService: DepartmentService,
    private readonly notificationService: NotificationService,
    private readonly firebaseService: FirebaseService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService
  ) {}

  async findById(id: string): Promise<Bill | undefined> {
    const options = { relations: relationshipNames };
    return await this.billRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Bill>): Promise<Bill | undefined> {
    return await this.billRepository.findOne(options);
  }

  async findAndCount(pageRequest: PageRequest, req: Request, currentUser: User): Promise<[Bill[], number]> {
    let departmentVisible = [];
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible.push(currentUser.department);
    }
    let queryString = "Bill.status <> 'DELETED' ";
    let filterString = '';

    if (departmentVisible.length > 0) {
      queryString += ` AND Bill.department IN ${JSON.stringify(departmentVisible.map(item => item.id))
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (req.query['endDate'] && req.query['startDate']) {
      queryString += ` ${queryString.length === 0 ? '' : ' AND '}  Bill.createdDate  >= '${
        req.query['startDate']
      }' AND  Bill.createdDate <= '${req.query['endDate']} 23:59:59'`;
    }
    const queryBuilder = this.billRepository
      .createQueryBuilder('Bill')
      .leftJoinAndSelect('Bill.order', 'order')
      .leftJoinAndSelect('Bill.customer', 'customer')
      .leftJoinAndSelect('order.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.product', 'product')
      .where(queryString)
      .orderBy(`Bill.${'createdDate'}`, 'DESC')
      .skip(pageRequest.page * pageRequest.size)
      .take(pageRequest.size);

    Object.keys(req.query).forEach((item, index) => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency' && item !== 'endDate' && item !== 'startDate') {
        queryBuilder.andWhere(`Bill.${item} like '%${req.query[item]}%'`);
      }
    });
    if (filterString) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          sqb.where(filterString);
        })
      );
    }
    // const result =  await queryBuilder.getManyAndCount()
    // result[0] = result[0].map(item => ({
    //   ...item,
    //   order: {
    //     ...item.order,
    //     orderDetails:item.order.orderDetails.sort((a, b) => {
    //       return Number(b.id) - Number(a.id);
    //     })
    //   }
    // }));
    return await queryBuilder.getManyAndCount();
  }

  async save(bill: Bill): Promise<Bill | undefined> {
    return await this.billRepository.save(bill);
  }

  async update(bill: Bill): Promise<Bill | undefined> {
    switch (bill.status) {
      case BillStatus.APPROVED:
        this.orderService.updateStatus({ id: bill.order.id, status: OrderStatus.COD_APPROVED });
        break;
      case BillStatus.CANCEL:
        this.orderService.updateStatus({ id: bill.order.id, status: OrderStatus.COD_CANCEL });
        break;
      case BillStatus.REJECTED:
        this.orderService.updateStatus({ id: bill.order.id, status: OrderStatus.REJECTED });
        break;
      case BillStatus.SHIPPING:
        this.orderService.updateStatus({ id: bill.order.id, status: OrderStatus.SHIPPING });
        break;
      case BillStatus.SUCCESS:
        this.orderService.updateStatus({ id: bill.order.id, status: OrderStatus.SUCCESS });
        break;
      case BillStatus.CREATED:
        this.orderService.updateStatus({ id: bill.order.id, status: OrderStatus.CREATED });
        break;
      case BillStatus.SUPPLY_WAITING:
        this.orderService.updateStatus({ id: bill.order.id, status: OrderStatus.SUPPLY_WAITING });
        break;
      default:
        break;
    }
    const foundedOrder = await this.findById(bill.id);

    let content = '';
    switch (foundedOrder.status) {
      case BillStatus.CREATED:
        content = `Vận đơn ${foundedOrder.code} đã được tạo`;
        break;
      case BillStatus.APPROVED:
        content = `Vận đơn ${foundedOrder.code} đã được duyệt`;
        break;
      case BillStatus.REJECTED:
        content = `Vận đơn ${foundedOrder.code} đã bị từ chối`;
        break;
      case BillStatus.CANCEL:
        content = `Vận đơn ${foundedOrder.code} đã bị hủy`;
        break;
      case BillStatus.SHIPPING:
        content = `Vận đơn ${foundedOrder.code} đang vận chuyển`;
        break;
      case BillStatus.SUCCESS:
        content = `Vận đơn ${foundedOrder.code} giao thành công`;
        break;
      case BillStatus.SUPPLY_WAITING:
        content = `Vận đơn ${foundedOrder.code} đang đợi xuất kho`;
        break;

      default:
        break;
    }
    await this.notificationService.save({
      content,
      type: 'ORDER',
      entityId: foundedOrder.order.id,
      user: foundedOrder.order.sale
    });
    await this.firebaseService.sendFirebaseMessages(
      [
        {
          token: foundedOrder.order.sale.fcmToken,
          title: 'Thông báo',
          message: content,
          data: {
            type: 'ORDER',
            entityId: foundedOrder.order.id,
          }
        }
      ],
      false
    );
    await this.billRepository.removeCache(['order']);
    return await this.save(bill);
  }

  async delete(bill: Bill): Promise<Bill | undefined> {
    return await this.billRepository.remove(bill);
  }
}
