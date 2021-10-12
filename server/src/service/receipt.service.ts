import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReceiptStatus } from '../domain/enumeration/receipt-status';
import { Brackets, FindManyOptions, FindOneOptions } from 'typeorm';
import Receipt from '../domain/receipt.entity';
import { ReceiptRepository } from '../repository/receipt.repository';
import { TransactionService } from './transaction.service';
import Transaction from '../domain/transaction.entity';
import { TransactionType } from '../domain/enumeration/transaction-type';
import { IncomeDashboardService } from './income-dashboard.service';
import { DashboardType } from '../domain/enumeration/dashboard-type';
import IncomeDashboard from '../domain/income-dashboard.entity';
import { User } from '../domain/user.entity';

const relationshipNames = [];
relationshipNames.push('customer');
relationshipNames.push('customer.sale');
relationshipNames.push('sale');
relationshipNames.push('sale.branch');
relationshipNames.push('customer.department');
relationshipNames.push('customer.type');
relationshipNames.push('approver');
relationshipNames.push('department');

@Injectable()
export class ReceiptService {
  logger = new Logger('ReceiptService');

  constructor(
    @InjectRepository(ReceiptRepository) private receiptRepository: ReceiptRepository,
    private readonly transactionService: TransactionService,
    private readonly incomeDashboardService: IncomeDashboardService
  ) {}

  async findById(id: string): Promise<Receipt | undefined> {
    const options = { relations: relationshipNames };
    return await this.receiptRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Receipt>): Promise<Receipt | undefined> {
    return await this.receiptRepository.findOne(options);
  }

  async countReceipt(
    filter,
    departmentVisible = [],
    isEmployee: boolean,
    currentUser: User): Promise<Receipt> {
    let queryString = '';
    let andQueryString = '';
    if (departmentVisible.length > 0) {
      andQueryString += ` ${andQueryString.length === 0? "":" AND "}  Receipt.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (filter['endDate'] && filter['startDate']) {
      andQueryString += ` ${andQueryString.length === 0? "":" AND "}  Receipt.createdDate  >= '${filter['startDate']}' AND Receipt.createdDate <= '${filter['endDate']} 23:59:59'`;
    }
    if (isEmployee) {
      andQueryString += ` ${andQueryString.length === 0? "":" AND "}  Receipt.sale = ${currentUser.id}`;
    }
    if (currentUser.branch) {
      if (!currentUser.branch.seeAll) {
        andQueryString += ` ${andQueryString.length === 0? "":" AND "}  Receipt.branch = ${currentUser.branch.id}`;
      }
    } else {
      andQueryString += ` ${andQueryString.length === 0? "":" AND "}  AND Receipt.branch is NULL `;
    }
    delete filter['startDate']
    delete filter['endDate']
    Object.keys(filter).forEach((item, index) => {
      queryString += `Receipt.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
    });
    const count = this.receiptRepository
    .createQueryBuilder('Receipt')
    .select('sum(Receipt.money)','money')
    .where(andQueryString)
    if (queryString) {
      count.andWhere(
        new Brackets(sqb => {
          sqb.where(queryString);
        })
      );
    }
    const result = await count.getRawOne();
    return result;
  }

  async findAndCount(
    options: FindManyOptions<Receipt>,
    filter,
    departmentVisible = [],
    isEmployee: boolean,
    currentUser: User
  ): Promise<[Receipt[], number]> {
    let queryString = '';

    let andQueryString = '';

    if (departmentVisible.length > 0) {
      andQueryString += ` ${andQueryString.length === 0? "":" AND "}  Receipt.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (filter['endDate'] && filter['startDate']) {
      andQueryString += ` ${andQueryString.length === 0? "":" AND "}  Receipt.createdDate  >= '${filter['startDate']}' AND Receipt.createdDate <= '${filter['endDate']} 23:59:59'`;
    }
    if (isEmployee) {
      andQueryString += ` ${andQueryString.length === 0? "":" AND "}  Receipt.sale = ${currentUser.id}`;
    }
    if (currentUser.branch) {
      if (!currentUser.branch.seeAll) {
        andQueryString += ` ${andQueryString.length === 0? "":" AND "}  Receipt.branch = ${currentUser.branch.id}`;
      }
    } else {
      andQueryString += ` ${andQueryString.length === 0? "":" AND "}  AND Receipt.branch is NULL `;
    }
    delete filter['startDate']
    delete filter['endDate']
    Object.keys(filter).forEach((item, index) => {
      queryString += `Receipt.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
    });
    const queryBuilder = this.receiptRepository
      .createQueryBuilder('Receipt')
      .leftJoinAndSelect('Receipt.customer', 'customer')
      .leftJoinAndSelect('Receipt.sale', 'sale')
      .leftJoinAndSelect('Receipt.approver', 'approver')
      .where(andQueryString)
      .orderBy(`Receipt.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take);
    if (queryString) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          sqb.where(queryString);
        })
      );
    }
    return await queryBuilder.getManyAndCount();

    // options.relations = relationshipNames;
    // return await this.receiptRepository.findAndCount(options);
  }

  async save(receipt: Receipt, currentUser: User): Promise<Receipt | undefined> {
    const count = await this.receiptRepository
      .createQueryBuilder('receipt')
      .select('DISTINCT()')
      .where(`receipt.code like '%${currentUser.department.code}%'`)
      .getCount();
    if (!receipt.id) {
      receipt.code = `PT-${currentUser.department.code}-${count + 1}`;
    }
    return await this.receiptRepository.save(receipt);
  }

  async update(receipt: Receipt): Promise<Receipt | undefined> {
    const entity = await this.findById(receipt.id);

    if (entity.status === ReceiptStatus.APPROVED && receipt.status === ReceiptStatus.APPROVED) {
      throw new HttpException('Phiếu thu đã được duyệt', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (receipt.status === ReceiptStatus.APPROVED) {
      const latestTransaction = await this.transactionService.findByfields({
        where: { customer: entity.customer },
        order: { createdDate: 'DESC' }
      });
      const transaction = new Transaction();
      transaction.customer = entity.customer;
      transaction.customerCode = entity.customer.code;
      transaction.customerName = entity.customer.name;
      transaction.sale = entity.sale;
      transaction.saleName = entity.sale.code;
      transaction.branch= entity.sale.branch;
      transaction.department = entity.department;
      transaction.receipt = entity;
      transaction.collectMoney = entity.money;
      transaction.type = TransactionType.PAYMENT;
      transaction.previousDebt = latestTransaction ? latestTransaction.earlyDebt : 0;
      transaction.earlyDebt = latestTransaction ? Number(latestTransaction.earlyDebt) - Number(entity.money) : 0 - Number(entity.money);
      await this.transactionService.save(transaction);
      // const incomeItem = new IncomeDashboard();
      // incomeItem.amount = entity.money;
      // incomeItem.departmentId = entity.department.id;
      // incomeItem.branchId = entity.sale.branch?.id;
      // incomeItem.type = DashboardType.DEBT;
      // incomeItem.saleId = entity.customer.sale.id;
      // await this.incomeDashboardService.save(incomeItem);
    }
    return await this.receiptRepository.save(receipt);
  }

  async delete(receipt: Receipt): Promise<Receipt | undefined> {
    return await this.receiptRepository.remove(receipt);
  }
}
