import { HttpException, HttpService, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { TransactionRepository } from '../repository/transaction.repository';
import { Brackets, FindManyOptions, FindOneOptions, In, Like } from 'typeorm';
import Customer from '../domain/customer.entity';
import { CustomerRepository } from '../repository/customer.repository';
import { DepartmentService } from './department.service';
import { TransactionService } from './transaction.service';
import { generateCacheKey, getDates, memoizedGetDistrictName, memoizedGetCityName } from './utils/helperFunc';
import { checkCodeContext } from './utils/normalizeString';
import Transaction from '../domain/transaction.entity';
import { OrderRepository } from '../repository/order.repository';
import { ReceiptRepository } from '../repository/receipt.repository';
import { StoreInputRepository } from '../repository/store-input.repository';
import { BillRepository } from '../repository/bill.repository';
import Receipt from '../domain/receipt.entity';
import StoreInput from '../domain/store-input.entity';
import Bill from '../domain/bill.entity';
import Order from '../domain/order.entity';

const relationshipNames = [];
relationshipNames.push('status');
relationshipNames.push('type');
relationshipNames.push('department');
relationshipNames.push('branch');
relationshipNames.push('sale');

@Injectable()
export class CustomerService {
  logger = new Logger('CustomerService');

  constructor(
    @InjectRepository(CustomerRepository) private customerRepository: CustomerRepository,
    @InjectRepository(TransactionRepository) private transactionRepository: TransactionRepository,
    @InjectRepository(TransactionRepository) private orderRepository: OrderRepository,
    @InjectRepository(TransactionRepository) private receiptRepository: ReceiptRepository,
    @InjectRepository(TransactionRepository) private storeInputRepository: StoreInputRepository,
    @InjectRepository(TransactionRepository) private billRepository: BillRepository,
    private httpService: HttpService
  ) {}

  async findById(id: string): Promise<Customer | undefined> {
    const options = { relations: relationshipNames };
    return await this.customerRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Customer>): Promise<Customer | undefined> {
    options.relations = relationshipNames;
    return await this.customerRepository.findOne(options);
  }

  async filterExact(options: FindManyOptions<Customer>, filter = {}): Promise<[Customer[], number]> {
    options.cache = 3600000;

    let andQueryString = '1=1 ';

    if (filter['sale']) {
      andQueryString += ` AND Customer.sale = ${filter['sale']}`;
    }
    if (filter['department']) {
      andQueryString += ` AND Customer.department = ${filter['department']}`;
    }
    if (filter['branch']) {
      andQueryString += ` AND Customer.branch = ${filter['branch']}`;
    }
    if (filter['type']) {
      andQueryString += ` AND Customer.type = ${filter['type']}`;
    }
    if (filter['activated']) {
      andQueryString += ` AND Customer.activated = ${filter['activated']}`;
    }
    const queryBuilder = this.customerRepository
      .createQueryBuilder('Customer')
      .leftJoinAndSelect('Customer.status', 'status')
      .leftJoinAndSelect('Customer.type', 'type')
      .leftJoinAndSelect('Customer.department', 'department')
      .leftJoinAndSelect('Customer.branch', 'branch')
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
    delete filter['activated'];
    delete filter['sale'];
    delete filter['branch'];
    delete filter['department'];
    delete filter['type'];
    const length = Object.keys(filter).length;
    // Object.keys(filter).forEach((item, index) => {
    //   queryString += `Customer.${item} like '%${filter[item]}%' ${length - 1 === index ? '' : 'OR '}`;
    // });
    if (length > 0) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          Object.keys(filter).forEach((item, index) => {
            sqb.orWhere(`Customer.${item} like '%${filter[item]}%'`);
          });
        })
      );
      count.andWhere(
        new Brackets(sqb => {
          Object.keys(filter).forEach((item, index) => {
            sqb.orWhere(`Customer.${item} like '%${filter[item]}%'`);
          });
        })
      );
    }
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
    if (filter['activated']) {
      andQueryString += ` AND Customer.activated = ${filter['activated']}`;
    }
    delete filter['activated'];
    delete filter['sale'];
    const cacheKeyBuilder = generateCacheKey(departmentVisible, currentUser, isEmployee, filter, options, 'customer');

    // const cacheKeyBuilder = `filter_customers_department_${JSON.stringify(departmentVisible)}_branch_${
    //   currentUser.branch ? (!currentUser.branch.seeAll ? currentUser.branch.id : -1) : null
    // }_sale_${isEmployee ? currentUser.id : -1}_filter_${JSON.stringify(filter)}_skip_${options.skip}_${options.take}_Customer.${Object.keys(
    //   options.order
    // )[0] || 'createdDate'}_${options.order[Object.keys(options.order)[0]] || 'DESC'}`;

    if (currentUser.branch) {
      if (!currentUser.branch.seeAll) {
        andQueryString += ` AND Customer.branch = ${currentUser.branch.id} `;
      }
    }

    const queryBuilder = this.customerRepository
      .createQueryBuilder('Customer')
      .leftJoinAndSelect('Customer.status', 'status')
      .leftJoinAndSelect('Customer.type', 'type')
      .leftJoinAndSelect('Customer.branch', 'branch')
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
    if (Object.keys(filter).length > 0) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          Object.keys(filter).forEach((item, index) => {
            sqb.orWhere(`Customer.${item} like '%${filter[item]}%'`);
          });
        })
      );
      count.andWhere(
        new Brackets(sqb => {
          Object.keys(filter).forEach((item, index) => {
            sqb.orWhere(`Customer.${item} like '%${filter[item]}%'`);
          });
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

    let andQueryString = '1=1 ';
    if (filter['findBirthday']) {
      const startDate = new Date();
      const endDate = new Date(new Date().setDate(new Date().getDate() + 7));
      const listDate = getDates(startDate, endDate);
      const listMonth = listDate.map(item => item.getMonth() + 1);
      const listDay = listDate.map(item => item.getDate());

      andQueryString += ` ${andQueryString.length === 0 ? '' : ' AND '}  MONTH(Customer.dateOfBirth) in ${JSON.stringify(listMonth)
        .replace('[', '(')
        .replace(']', ')')} AND DAY(Customer.dateOfBirth) IN ${JSON.stringify(listDay)
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
    if (filter['activated']) {
      andQueryString += ` AND Customer.activated = ${filter['activated']}`;
    }
    delete filter['activated'];
    delete filter['sale'];
    let queryString = '';
    const arr = Object.keys(filter);
    arr.forEach((item, index) => {
      if (item === 'findBirthday') return;
      queryString += `Customer.${item} like '%${filter[item]}%' ${arr.length - 1 === index ? '' : 'AND '}`;
    });
    if (queryString.trim().substr(queryString.length - 4, queryString.length - 1) === 'AND') {
      queryString = queryString.substr(0, queryString.length - 4);
    }
    const cacheKeyBuilder = generateCacheKey(departmentVisible, currentUser, isEmployee, filter, options, 'customer');

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
      .leftJoinAndSelect('Customer.branch', 'branch')
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

  async save(customer: Customer): Promise<Customer | undefined> {
    let error = '';
    await this.customerRepository.removeCache(['customer']);
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
    } else {
      const result = this.httpService.post('https://api.fastwork.vn:6010/v1/customer?tokenkey=fb5aef467aa3dabe6f079993df63fe78', {
        customer_name: customer.name,
        customer_address: customer.address,
        customer_tel: customer.tel,
        customer_email: '',
        customer_note: '',
        customer_city: memoizedGetCityName(customer.city),
        customer_district: memoizedGetDistrictName(customer.district),
        customer_type: customer.type.name,
        customer_group: '',
        customer_source: '',
        customer_scale: '',
        customer_field: '',
        customer_code: customer.code,
        contact_name: customer.contactName,
        contact_address: customer.address,
        contact_tel: customer.tel,
        customer_assign: [`${customer.sale.code}@mydico`],
        contact_email: '',
        contact_title: '',
        contact_vocative: '',
        customer_created: customer.createdBy
      });
      await result.toPromise().catch(e => (error = e.message));
    }
    const foundedCustomer = await this.customerRepository.find({
      code: Like(`%${customer.code}%`),
      activated: true
    });
    const newCustomer = checkCodeContext(customer, foundedCustomer);
    newCustomer.errorLogs = error;
    return await this.customerRepository.save(newCustomer);
  }

  async updateStatus(customer: Customer): Promise<Customer | undefined> {
    await this.customerRepository.removeCache(['customer']);
    return await this.customerRepository.save(customer);
  }

  async update(customer: Customer): Promise<Customer | undefined> {
    await this.transactionRepository
      .createQueryBuilder()
      .update(Transaction)
      .set({ customerCode: customer.code, customerName: customer.name })
      .where('customerId = :id', { id: customer.id })
      .execute();
    await this.orderRepository
      .createQueryBuilder()
      .update(Order)
      .set({ customerName: customer.name })
      .where('customerId = :id', { id: customer.id })
      .execute();
    await this.billRepository
      .createQueryBuilder()
      .update(Bill)
      .set({ customerName: customer.name })
      .where('customerId = :id', { id: customer.id })
      .execute();
    await this.storeInputRepository
      .createQueryBuilder()
      .update(StoreInput)
      .set({ customerName: customer.name })
      .where('customerId = :id', { id: customer.id })
      .execute();
    await this.receiptRepository
      .createQueryBuilder()
      .update(Receipt)
      .set({ customerName: customer.name })
      .where('customerId = :id', { id: customer.id })
      .execute();
    return await this.save(customer);
  }

  async saveMany(customers: Customer[]): Promise<Customer[] | undefined> {
    await this.customerRepository.removeCache(['customer']);
    // select max(id) as ids from transaction where saleId in(4,1) group by saleId
    const getTransIds = this.transactionRepository
      .createQueryBuilder('Transaction')
      .select('MAX(Transaction.id)', 'id')
      .where(
        `Transaction.customerId IN ${JSON.stringify(customers.map(item => item.id))
          .replace('[', '(')
          .replace(']', ')')}`
      )
      .groupBy('Transaction.customerId');

    const rawData = await getTransIds.getRawMany();
    const debt = await this.transactionRepository.find({
      where: {
        id: In(rawData.map(item => item.id))
      }
    });
    const customerHaveDebt = debt.filter(item => item.earlyDebt > 0);
    if (customerHaveDebt.length > 0) {
      const customerCode = `${customerHaveDebt.map(item => item.customerCode).join(', ')}`;
      throw new HttpException(
        `Khách hàng ${customerCode} còn công nợ.Hãy thanh toán hết công nợ trước khi chuyển`,
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
    return await this.customerRepository.save(customers);
  }

  async delete(customer: Customer): Promise<Customer | undefined> {
    return await this.customerRepository.remove(customer);
  }
}
