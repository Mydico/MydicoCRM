import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { Brackets, FindManyOptions, FindOneOptions, In, Like } from 'typeorm';
import Customer from '../domain/customer.entity';
import { CustomerRepository } from '../repository/customer.repository';
import { DepartmentService } from './department.service';
import { checkCodeContext } from './utils/normalizeString';

const relationshipNames = [];
relationshipNames.push('status');
relationshipNames.push('type');
relationshipNames.push('department');
relationshipNames.push('sale');

@Injectable()
export class CustomerService {
  logger = new Logger('CustomerService');

  constructor(@InjectRepository(CustomerRepository) private customerRepository: CustomerRepository) {}

  async findById(id: string): Promise<Customer | undefined> {
    const options = { relations: relationshipNames };
    return await this.customerRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Customer>): Promise<Customer | undefined> {
    return await this.customerRepository.findOne(options);
  }

  async findAndCount(
    options: FindManyOptions<Customer>,
    filter = [],
    departmentVisible = [],
    isEmployee: boolean,
    currentUser: User
  ): Promise<[Customer[], number]> {
    options.relations = relationshipNames;
    // options.cache = 3600000
    let queryString = '';
    Object.keys(filter).forEach((item, index) => {
      queryString += `Customer.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'OR '}`;
    });
    let andQueryString = '';

    if (departmentVisible.length > 0) {
      andQueryString += `Customer.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (isEmployee) andQueryString += ` AND Customer.sale = ${currentUser.id}`;

    const queryBuilder = this.customerRepository
      .createQueryBuilder('Customer')
      .leftJoinAndSelect('Customer.status', 'status')
      .leftJoinAndSelect('Customer.type', 'type')
      .leftJoinAndSelect('Customer.department', 'department')
      .leftJoinAndSelect('Customer.sale', 'sale')
      .where(andQueryString)

      .orderBy(`Customer.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take)
      if(queryString){
        queryBuilder.andWhere(
          new Brackets(sqb => {
            sqb.where(queryString);
          })
        )
      }
      return await queryBuilder.getManyAndCount();
    // return await this.customerRepository.findAndCount(options);
  }

  async save(customer: Customer): Promise<Customer | undefined> {
    const foundedCustomer = await this.customerRepository.find({
      code: Like(`%${customer.code}%`)
    });
    const newCustomer = checkCodeContext(customer, foundedCustomer);
    return await this.customerRepository.save(newCustomer);
  }

  async update(customer: Customer): Promise<Customer | undefined> {
    return await this.customerRepository.save(customer);
  }

  async delete(customer: Customer): Promise<Customer | undefined> {
    return await this.customerRepository.remove(customer);
  }
}
