import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Brackets, FindManyOptions, FindOneOptions } from 'typeorm';
import Transaction from '../domain/transaction.entity';
import { TransactionRepository } from '../repository/transaction.repository';
import Customer from '../domain/customer.entity';
import { queryBuilderFunc } from '../utils/helper/permission-normalization';

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

  async findManyByfields(options: FindOneOptions<Transaction>): Promise<[Transaction[], number]> {
    return await this.transactionRepository.findAndCount(options);
  }

  async countDebit(
    filter = {},
    departmentVisible = [],
    isEmployee: boolean,
    allowToSeeAll: boolean,
    currentUser: User
  ): Promise<[Transaction[], number]> {
    let queryString = '1=1';
    let andQueryString = '';
    // Object.keys(filter).forEach((item, index) => {
    //   if (item === 'endDate' || item === 'startDate') return;
    //   const specialCharacter = filter[item].includes('_') ? filter[item].replace('_', '\\_') : filter[item];
    //   queryString += `AND Transaction.${item} like '%${specialCharacter}%' ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
    // });

    if (departmentVisible.length > 0) {
      queryString += ` AND Transaction.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (filter['endDate']) {
      queryString += ` AND Transaction.createdDate <='${
        filter['endDate']
      } 23:59:59'`;
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
    delete filter['page'];
    delete filter['size'];
    delete filter['sort'];
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

  async findAndCountDetail(options: FindManyOptions<Transaction>, filter: {}): Promise<[Transaction[], number]> {
    options.relations = relationshipNames;
    let customQuery = ''
    if(filter['entity']){
      customQuery += `order.code like '%${filter['entity']}%' OR receipt.code like '%${filter['entity']}%'`
    }
    delete filter['entity']
    // console.log(filter)
    let queryString = queryBuilderFunc('Transaction', filter);


    // if(filter['entity']){
    //   customQuery += `order.code like '%${filter['entity']}%' AND receipt.code like '%${filter['entity']}%'`
    // }
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .leftJoinAndSelect('Transaction.customer', 'customer')
      .leftJoinAndSelect('Transaction.order', 'order')
      .leftJoinAndSelect('Transaction.receipt', 'receipt')
      .leftJoinAndSelect('Transaction.storeInput', 'storeInput')
      .skip(options.skip)
      .take(options.take)
      .where(queryString)
      .orderBy({
        'Transaction.createdDate': options.order[Object.keys(options.order)[0]] || 'DESC',
      })

      if(customQuery){
        queryBuilder.andWhere(
          new Brackets(sqb => {
            sqb.where(customQuery);
          })
        );
      }
     return await queryBuilder.getManyAndCount()
    // const count = this.transactionRepository
    //   .createQueryBuilder('Order')
    //   .leftJoinAndSelect('Order.customer', 'customer')
    //   .leftJoinAndSelect('Order.orderDetails', 'orderDetails')
    //   .leftJoinAndSelect('orderDetails.product', 'product')
    //   .leftJoinAndSelect('Order.promotion', 'promotion')
    //   .leftJoinAndSelect('promotion.customerType', 'customerType')
    //   .leftJoinAndSelect('Order.sale', 'sale')
    //   .leftJoinAndSelect('Order.department', 'department')
    //   .where(queryString)
    //   .orderBy(`Order.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
    //   .skip(options.skip)
    //   .take(options.take)
    //   .cache(3 * 3600)
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
    let andQueryString = ' ';

    if (departmentVisible.length > 0) {
      andQueryString += ` Transaction.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (filter['endDate'] && filter['startDate']) {
      andQueryString += ` AND Transaction.createdDate  >= '${filter['startDate']}' AND Transaction.createdDate <= '${
        filter['endDate']
      } 23:59:59'`;
    }
    if (!allowViewAll) {
      if (isEmployee) {
        andQueryString += ` AND Transaction.sale = ${currentUser.id}`;
      }
      if (currentUser.branch) {
        if (!currentUser.branch.seeAll) {
          andQueryString += ` AND Transaction.branch = ${currentUser.branch.id}`;
        }
      }
    }

    delete filter['startDate'];
    delete filter['endDate'];
;
    Object.keys(filter).forEach((item, index) => {
      queryString += ` Transaction.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : ' AND '}`;
    });
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['Transaction.customerId, Transaction.customerCode, Transaction.saleName'])
      .addSelect('SUM(Transaction.total_money)-SUM(Transaction.collect_money)-SUM(Transaction.refund_money)', 'debt')
      .addSelect('MAX(Transaction.id)', 'id')
      .addSelect('MAX(Transaction.customerName)', 'customer_name')
      .addSelect('MAX(Transaction.createdDate)', 'createdDate')
      .addSelect('MAX(`Transaction`.`departmentId`)', 'departmentId')
      .addSelect('MAX(`Transaction`.`saleId`)', 'saleId')
      .addSelect('MAX(`Transaction`.`branchId`)', 'branchId')
      .where(andQueryString)
      .groupBy('Transaction.customerId, Transaction.customerCode, Transaction.saleName')
      .orderBy(`MAX(Transaction.${Object.keys(options.order)[0] || 'createdDate'})`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take);
    const count = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select(['Transaction.customerId, Transaction.customerCode, Transaction.saleName'])
      .where(andQueryString)
      .groupBy('Transaction.customerId, Transaction.customerCode, Transaction.saleName')

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
    const rawData = await queryBuilder.getRawMany();
    const countMany = await count.getRawMany();
    const convertedEntity: Transaction[] = rawData?.map(item => ({
      id: item.id,
      customerCode: item.customer_code,
      customerId: item.customerId,
      saleName: item.sale_name,
      debt: item.debt,
      customerName: item.customer_name,
      createdDate: item.createdDate
    }));
    return [convertedEntity, countMany.length];
  }

  async save(transaction: Transaction): Promise<Transaction | undefined> {
    const exist = await this.transactionRepository.findOne({ where: { customer: transaction.customer } });
    if (!transaction.order && !transaction.receipt && !transaction.storeInput && exist) {
      throw new HttpException('Khách hàng này đã có công nợ', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return await this.transactionRepository.save(transaction);
  }

  async update(transaction: Transaction): Promise<Transaction | undefined> {
    return await this.save(transaction);
  }

  async delete(transaction: Transaction): Promise<Transaction | undefined> {
    return await this.transactionRepository.remove(transaction);
  }
}
