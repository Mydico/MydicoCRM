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

const relationshipNames = [];
relationshipNames.push('customer');
relationshipNames.push('transporter');
relationshipNames.push('order');
relationshipNames.push('store');

@Injectable()
export class BillService {
  logger = new Logger('BillService');

  constructor(
    @InjectRepository(BillRepository) private billRepository: BillRepository,
    private readonly departmentService: DepartmentService,

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
    Object.keys(req.query).forEach((item, index) => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency' && item !== 'endDate' && item !== 'startDate') {
        filterString += `Bill.${item} like '%${req.query[item]}%' ${Object.keys(req.query).length - 1 === index ? '' : 'AND '}`;
      }
    });
    if (departmentVisible.length > 0) {
      queryString += ` AND Bill.department IN ${JSON.stringify(departmentVisible.map(item => item.id))
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (req.query['endDate'] && req.query['startDate']) {
      queryString += ` ${queryString.length === 0 ? '' : ' AND '}  Bill.createdDate  >= '${req.query['startDate']}' AND  Bill.createdDate <= '${
        req.query['endDate']
      } 24:00:00'`;
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
    if (filterString) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          sqb.where(filterString);
        })
      );
    }
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

    await this.billRepository.removeCache(['order']);
    return await this.save(bill);
  }

  async delete(bill: Bill): Promise<Bill | undefined> {
    return await this.billRepository.remove(bill);
  }
}
