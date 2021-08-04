import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { Brackets, FindManyOptions, FindOneOptions, In, Like } from 'typeorm';
import Customer from '../domain/customer.entity';
import { CustomerRepository } from '../repository/customer.repository';
import { DepartmentService } from './department.service';
import { getDates } from './utils/helperFunc';
import { checkCodeContext } from './utils/normalizeString';

const relationshipNames = [];
relationshipNames.push('status');
relationshipNames.push('type');
relationshipNames.push('department');
relationshipNames.push('branch');
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
    options.relations = relationshipNames;
    return await this.customerRepository.findOne(options);
  }

  async filterExact(options: FindManyOptions<Customer>, filter = {}, departmentVisible = []): Promise<[Customer[], number]> {
    options.cache = 3600000;
    let queryString = '';
    const length = Object.keys(filter).includes('sale') ? Object.keys(filter).length - 1 : Object.keys(filter).length;
    Object.keys(filter).forEach((item, index) => {
      if (item === 'sale') return;
      if (item === 'branch') return;
      queryString += `Customer.${item} like '%${filter[item]}%' ${length - 1 === index ? '' : 'AND '}`;
    });
    let andQueryString = '1=1 ';

    if (departmentVisible.length > 0) {
      andQueryString += `AND Customer.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }

    if (filter['sale']) {
      andQueryString += ` AND Customer.sale = ${filter['sale']}`;
    }
    if (filter['branch']) {
      andQueryString += ` AND Customer.branch = ${filter['branch']}`;
    }
    const queryBuilder = this.customerRepository
      .createQueryBuilder('Customer')
      .leftJoinAndSelect('Customer.status', 'status')
      .leftJoinAndSelect('Customer.type', 'type')
      .leftJoinAndSelect('Customer.department', 'department')
      .leftJoinAndSelect('Customer.sale', 'sale')
      .where(andQueryString)
      .orderBy(`Customer.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take);

    const count = this.customerRepository
      .createQueryBuilder('Customer')
      .where(andQueryString)
      .orderBy(`Customer.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take);

    const result = await queryBuilder.getManyAndCount();
    result[1] = await count.getCount();
    return result;
  }

  async filter(
    options: FindManyOptions<Customer>,
    filter = {},
    departmentVisible = [],
    isEmployee: boolean,
    currentUser: User
  ): Promise<[Customer[], number]> {
    options.cache = 3600000;
    let queryString = '';
    const length = Object.keys(filter).includes('sale') ? Object.keys(filter).length - 1 : Object.keys(filter).length;
    Object.keys(filter).forEach((item, index) => {
      if (item === 'sale') return;
      queryString += `Customer.${item} like '%${filter[item]}%' ${length - 1 === index ? '' : 'OR '}`;
    });
    let andQueryString = '1=1 ';

    if (departmentVisible.length > 0) {
      andQueryString += `AND Customer.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (isEmployee) {
      andQueryString += ` AND Customer.sale = ${currentUser.id}`;
    }
    if (filter['sale']) {
      andQueryString += ` AND Customer.sale = ${filter['sale']}`;
    }
    const cacheKeyBuilder = `filter_customers_department_${JSON.stringify(departmentVisible)}_branch_${
      currentUser.branch ? (!currentUser.branch.seeAll ? currentUser.branch.id : -1) : null
    }_sale_${isEmployee ? currentUser.id : -1}_filter_${JSON.stringify(filter)}_skip_${options.skip}_${options.take}_Customer.${Object.keys(
      options.order
    )[0] || 'createdDate'}_${options.order[Object.keys(options.order)[0]] || 'DESC'}`;

    if (currentUser.branch) {
      if (!currentUser.branch.seeAll) {
        andQueryString += ` AND Customer.branch = ${currentUser.branch.id} `;
      }
    }

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
      .cache(cacheKeyBuilder, 3600000);

    const count = this.customerRepository
      .createQueryBuilder('Customer')
      .where(andQueryString)
      .orderBy(`Customer.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take)
      .cache(
        `cache_filter_get_customers_department_${JSON.stringify(departmentVisible)}_branch_${
          currentUser.branch ? (!currentUser.branch.seeAll ? currentUser.branch.id : -1) : null
        }_sale_${isEmployee ? currentUser.id : -1}_filter_${JSON.stringify(filter)}`
      );
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

    const result = await queryBuilder.getManyAndCount();
    result[1] = await count.getCount();
    return result;
  }

  async findAndCount(
    options: FindManyOptions<Customer>,
    filter = {},
    departmentVisible = [],
    isEmployee: boolean,
    currentUser: User
  ): Promise<[Customer[], number]> {
    options.cache = 3600000;
    let queryString = '';
    Object.keys(filter).forEach((item, index) => {
      if (item === 'findBirthday') return;
      queryString += `Customer.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
    });
    let andQueryString = '1=1 ';
    if (filter['findBirthday']) {
      const startDate = new Date();
      const endDate = new Date(new Date().setDate(new Date().getDate() + 7));
      const listDate = getDates(startDate, endDate);
      const listMonth = listDate.map(item => item.getMonth() + 1);
      const listDay = listDate.map(item => item.getDate());
      andQueryString += ` ${andQueryString.length === 0 ? '' : ' AND '}  MONTH(Customer.dateOfBirth) in ${JSON.stringify(listMonth)
        .replace('[', '(')
        .replace(']', ')')} AND  DAY(Customer.dateOfBirth) IN ${JSON.stringify(listDay)
        .replace('[', '(')
        .replace(']', ')')} `;
    }
    if (departmentVisible.length > 0) {
      andQueryString += `AND Customer.department IN ${JSON.stringify(departmentVisible)
        .replace('[', '(')
        .replace(']', ')')}`;
    }
    if (isEmployee) {
      andQueryString += ` AND Customer.sale = ${currentUser.id}`;
    }

    const cacheKeyBuilder = `get_customers_department_${andQueryString}_${JSON.stringify(departmentVisible)}_branch_${
      currentUser.branch ? (!currentUser.branch.seeAll ? currentUser.branch.id : -1) : null
    }_sale_${isEmployee ? currentUser.id : -1}_filter_${JSON.stringify(filter)}_skip_${options.skip}_${options.take}_Customer.${Object.keys(
      options.order
    )[0] || 'createdDate'}_${options.order[Object.keys(options.order)[0]] || 'DESC'}`;

    if (currentUser.branch) {
      if (!currentUser.branch.seeAll) {
        andQueryString += ` AND Customer.branch = ${currentUser.branch.id} `;
      }
    }

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
      .cache(cacheKeyBuilder, 3600000);

    const count = this.customerRepository
      .createQueryBuilder('Customer')
      .where(andQueryString)
      .orderBy(`Customer.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take)
      .cache(
        `cache_count_get_customers_department_${JSON.stringify(departmentVisible)}_branch_${
          currentUser.branch ? (!currentUser.branch.seeAll ? currentUser.branch.id : -1) : null
        }_sale_${isEmployee ? currentUser.id : -1}_filter_${JSON.stringify(filter)}`
      );
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

    const result = await queryBuilder.getManyAndCount();
    result[1] = await count.getCount();
    return result;
  }

  async save(customer: Customer, departmentVisible = [], isEmployee: boolean, currentUser: User): Promise<Customer | undefined> {
    const cacheKeyBuilder = `get_customers_department_${JSON.stringify(departmentVisible)}_sale_${isEmployee ? currentUser.id : -1}`;
    await this.customerRepository.removeCache([cacheKeyBuilder, 'Customer']);
    if (customer.id) {
      const foundedCustomer = await this.customerRepository.findOne({
        code: customer.code
      });
      let tempCustomer = customer;
      if (foundedCustomer && foundedCustomer.id !== customer.id) {
        const foundedCustomerList = await this.customerRepository.find({
          code: Like(`%${customer.code}%`)
        });
        const newCustomer = checkCodeContext(customer, foundedCustomerList);
        tempCustomer = newCustomer;
      }
      const result = await this.customerRepository.save(tempCustomer);
      return result;
    }
    const foundedCustomer = await this.customerRepository.find({
      code: Like(`%${customer.code}%`)
    });
    const newCustomer = checkCodeContext(customer, foundedCustomer);
    return await this.customerRepository.save(newCustomer);
  }

  async update(customer: Customer, departmentVisible = [], isEmployee: boolean, currentUser: User): Promise<Customer | undefined> {
    return await this.save(customer, departmentVisible, isEmployee, currentUser);
  }

  async saveMany(customers: Customer[]): Promise<Customer[] | undefined> {
    const cacheKeyBuilder = `get_customers_department`;
    await this.customerRepository.removeCache([cacheKeyBuilder, 'Customer']);
    return await this.customerRepository.save(customers);
  }

  async delete(customer: Customer): Promise<Customer | undefined> {
    return await this.customerRepository.remove(customer);
  }
}
