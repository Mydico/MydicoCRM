import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Brackets, FindManyOptions, FindOneOptions } from 'typeorm';
import CustomerDebit from '../domain/customer-debit.entity';
import { CustomerDebitRepository } from '../repository/customer-debit.repository';

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

  async findAndCount(
    options: FindManyOptions<CustomerDebit>,
    filter = [],
    departmentVisible = [],
    isEmployee: boolean,
    currentUser: User
  ): Promise<[CustomerDebit[], number]> {
    let queryString = '';
    Object.keys(filter).forEach((item, index) => {
      queryString += `CustomerDebit.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'OR '}`;
    });
    let andQueryString = '1=1 ';

    if (departmentVisible.length > 0) {
      andQueryString += `AND CustomerDebit.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (isEmployee) andQueryString += ` AND CustomerDebit.sale = ${currentUser.id}`;
    if (currentUser.branch) {
      if (!currentUser.branch.seeAll) {
        andQueryString += ` AND CustomerDebit.branch = ${currentUser.branch.id}`;
      }
    }else{
      andQueryString += ` AND CustomerDebit.branch is NULL`;
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
    // return await this.customerDebitRepository.findAndCount(options);
  }

  async save(customerDebit: CustomerDebit): Promise<CustomerDebit | undefined> {
    return await this.customerDebitRepository.save(customerDebit);
  }

  async update(customerDebit: CustomerDebit): Promise<CustomerDebit | undefined> {
    return await this.save(customerDebit);
  }

  async delete(customerDebit: CustomerDebit): Promise<CustomerDebit | undefined> {
    return await this.customerDebitRepository.remove(customerDebit);
  }
}
