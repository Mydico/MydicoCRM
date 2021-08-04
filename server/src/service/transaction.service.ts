import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Brackets, FindManyOptions, FindOneOptions } from 'typeorm';
import Transaction from '../domain/transaction.entity';
import { TransactionRepository } from '../repository/transaction.repository';
import Customer from '../domain/customer.entity';

const relationshipNames = [];
relationshipNames.push('customer');
relationshipNames.push('customer.sale');
relationshipNames.push('bill');
relationshipNames.push('sale');
relationshipNames.push('receipt');
relationshipNames.push('order');
relationshipNames.push('storeInput');
@Injectable()
export class TransactionService {
  logger = new Logger('TransactionService');

  constructor(@InjectRepository(TransactionRepository) private transactionRepository: TransactionRepository) {}

  async findById(id: string): Promise<Transaction | undefined> {
    const options = { relations: relationshipNames };
    return await this.transactionRepository.findOne(id, options);
  }

  async getDebForOneCustomer(customerId: string): Promise<any> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select('SUM(Transaction.total_money)-SUM(Transaction.collect_money)-SUM(Transaction.refund_money)', 'sum')
      .where(`Transaction.customerId = ${customerId}`);

    return await queryBuilder.getRawOne();
  }

  async findByfields(options: FindOneOptions<Transaction>): Promise<Transaction | undefined> {
    return await this.transactionRepository.findOne(options);
  }

  async findManyByfields(options: FindOneOptions<Transaction>): Promise<[Transaction[] ,number]> {
    return await this.transactionRepository.findAndCount(options);
  }

  async countDebit(
    filter = {},
    departmentVisible = [],
    isEmployee: boolean,
    allowToSeeAll: boolean,
    currentUser: User
  ): Promise<[Transaction[], number]> {
    let queryString = '1=1 ';
    Object.keys(filter).forEach((item, index) => {
      if (item === 'endDate' || item === 'startDate') return;
      const specialCharacter = filter[item].includes('_') ? filter[item].replace('_', '\\_') : filter[item];
      queryString += `AND Transaction.${item} like '%${specialCharacter}%' ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
    });

    if (departmentVisible.length > 0) {
      queryString += ` AND Transaction.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (filter['endDate'] && filter['startDate']) {
      queryString += ` AND Transaction.createdDate  >= '${filter['startDate']}' AND Transaction.createdDate <='${
        filter['endDate']
      } 24:00:00'`;
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
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select('SUM(Transaction.total_money)-SUM(Transaction.collect_money)-SUM(Transaction.refund_money)', 'sum')
      .where(queryString);

    return await queryBuilder.getRawOne();
  }

  async findAndCountDetail(options: FindManyOptions<Transaction>): Promise<[Transaction[], number]> {
    options.relations = relationshipNames;
    return await this.transactionRepository.findAndCount(options);
  }

  async findAndCount(
    options: FindManyOptions<Transaction>,
    filter = {},
    departmentVisible = [],
    isEmployee: boolean,
    allowViewAll: boolean,
    currentUser: User
  ): Promise<[Transaction[], number]> {
    let queryString = '';
    Object.keys(filter).forEach((item, index) => {
      if (item === 'endDate' || item === 'startDate') return;
      queryString += `Transaction.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
    });
    let andQueryString = ' ';

    if (departmentVisible.length > 0) {
      andQueryString += ` Transaction.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (filter['endDate'] && filter['startDate']) {
      andQueryString += ` AND Transaction.createdDate  >= '${filter['startDate']}' AND Transaction.createdDate <= '${
        filter['endDate']
      } 24:00:00'`;
    }
    if (!allowViewAll) {
      if (isEmployee) {
        andQueryString += ` AND Transaction.sale = ${currentUser.id}`;
      }
      // if (currentUser.branch) {
      //   if (!currentUser.branch.seeAll) {
      //     andQueryString += ` AND Transaction.branch = ${currentUser.branch.id}`;
      //   }
      // }
    }

    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['Transaction.customerId, Transaction.customerName, Transaction.customerCode, Transaction.saleName'])
      .addSelect('SUM(Transaction.total_money)-SUM(Transaction.collect_money)-SUM(Transaction.refund_money)', 'debt')
      .addSelect('MAX(Transaction.id)', 'id')
      .addSelect('MAX(Transaction.createdDate)', 'createdDate')
      .addSelect('MAX(`Transaction`.`departmentId`)', 'departmentId')
      .addSelect('MAX(`Transaction`.`saleId`)', 'saleId')
      .addSelect('MAX(`Transaction`.`branchId`)', 'branchId')
      .where(andQueryString)
      .groupBy('Transaction.customerId, Transaction.customerName, Transaction.customerCode, Transaction.saleName')
      .orderBy(`MAX(Transaction.${Object.keys(options.order)[0] || 'createdDate'})`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take);

    if (queryString) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          sqb.where(queryString);
        })
      );
    }
    const rawData = await queryBuilder.getRawMany();
    const convertedEntity: Transaction[] = rawData.map(item => ({
      id: item.id,
      customerCode: item.customer_code,
      customerId: item.customerId,
      saleName: item.sale_name,
      debt: item.debt,
      customerName: item.customer_name,
      createdDate: item.createdDate
    }));
    return [convertedEntity, rawData.length];
  }

  async save(transaction: Transaction): Promise<Transaction | undefined> {
    return await this.transactionRepository.save(transaction);
  }

  async update(transaction: Transaction): Promise<Transaction | undefined> {
    return await this.save(transaction);
  }

  async delete(transaction: Transaction): Promise<Transaction | undefined> {
    return await this.transactionRepository.remove(transaction);
  }
}
