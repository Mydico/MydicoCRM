import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Brackets, FindManyOptions, FindOneOptions } from 'typeorm';
import CustomerDebit from '../domain/customer-debit.entity';
import { CustomerDebitRepository } from '../repository/customer-debit.repository';
import { HttpException } from '@nestjs/common';

const relationshipNames = [];
relationshipNames.push('customer');
relationshipNames.push('sale');

@Injectable()
export class CustomerDebitService {
  logger = new Logger('CustomerDebitService');

  constructor(@InjectRepository(CustomerDebitRepository) private customerDebitRepository: CustomerDebitRepository) {}

  async findById(id: string): Promise<CustomerDebit | undefined> {
    const options = { relations: relationshipNames };
    return await this.customerDebitRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<CustomerDebit>): Promise<CustomerDebit | undefined> {
    return await this.customerDebitRepository.findOne(options);
  }

  async countDebit(
    filter = {},
    departmentVisible = [],
    isEmployee: boolean,
    allowToSeeAll: boolean,
    currentUser: User
  ): Promise<[CustomerDebit[], number]> {
    let queryString = '1=1 ';
    Object.keys(filter).forEach((item, index) => {
      if (item === 'endDate' || item === 'startDate') return;
      const specialCharacter = filter[item].includes('_') ? filter[item].replace('_', '\\_') : filter[item];
      queryString += `AND CustomerDebit.${item} like '%${specialCharacter}%' ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
    });

    if (departmentVisible.length > 0) {
      queryString += ` AND CustomerDebit.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (filter['endDate'] && filter['startDate']) {
      queryString += ` AND CustomerDebit.lastModifiedDate  >= '${filter['startDate']}' AND CustomerDebit.lastModifiedDate <='${
        filter['endDate']
      } 24:00:00'`;
    }
    if (!allowToSeeAll) {
      if (isEmployee) {
        queryString += ` AND CustomerDebit.sale = ${currentUser.id}`;
      }
      if (currentUser.branch) {
        if (!currentUser.branch.seeAll) {
          queryString += ` AND CustomerDebit.branch = ${currentUser.branch.id}`;
        }
      }
    }
    const queryBuilder = this.customerDebitRepository
      .createQueryBuilder('CustomerDebit')
      .select('SUM(CustomerDebit.debt)', 'sum')
      .where(queryString);

    return await queryBuilder.getRawOne();
  }

  async findAndCount(
    options: FindManyOptions<CustomerDebit>,
    filter = {},
    departmentVisible = [],
    isEmployee: boolean,
    allowViewAll: boolean,
    currentUser: User
  ): Promise<[CustomerDebit[], number]> {
    let queryString = '';
    Object.keys(filter).forEach((item, index) => {
      if (item === 'endDate' || item === 'startDate') return;
      queryString += `CustomerDebit.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
    });
    let andQueryString = '1=1 ';

    if (departmentVisible.length > 0) {
      andQueryString += `AND CustomerDebit.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (filter['endDate'] && filter['startDate']) {
      andQueryString += ` AND CustomerDebit.lastModifiedDate  >= '${filter['startDate']}' AND CustomerDebit.lastModifiedDate <= '${
        filter['endDate']
      } 24:00:00'`;
    }
    if (!allowViewAll) {
      if (isEmployee) {
        andQueryString += ` AND CustomerDebit.sale = ${currentUser.id}`;
      }
      if (currentUser.branch) {
        if (!currentUser.branch.seeAll) {
          andQueryString += ` AND CustomerDebit.branch = ${currentUser.branch.id}`;
        }
      }
    }

    const queryBuilder = this.customerDebitRepository
      .createQueryBuilder('CustomerDebit')
      .leftJoinAndSelect('CustomerDebit.customer', 'customer')
      .leftJoinAndSelect('CustomerDebit.sale', 'sale')
      .where(andQueryString)
      .orderBy(`CustomerDebit.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
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
  }

  async save(customerDebit: CustomerDebit): Promise<CustomerDebit | undefined> {
    const exist = await this.customerDebitRepository.findOne({ where: { customer: customerDebit.customer } });
    if (exist) {
      throw new HttpException('Khách hàng này đã có công nợ', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return await this.customerDebitRepository.save(customerDebit);
  }

  async update(customerDebit: CustomerDebit): Promise<CustomerDebit | undefined> {
    return await this.save(customerDebit);
  }

  async delete(customerDebit: CustomerDebit): Promise<CustomerDebit | undefined> {
    return await this.customerDebitRepository.remove(customerDebit);
  }
}
