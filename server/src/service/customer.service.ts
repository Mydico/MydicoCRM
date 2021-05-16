import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { FindManyOptions, FindOneOptions, In, Like } from 'typeorm';
import Customer from '../domain/customer.entity';
import { CustomerRepository } from '../repository/customer.repository';
import { DepartmentService } from './department.service';
import { checkCodeContext } from './utils/normalizeString';

const relationshipNames = [];
relationshipNames.push('status');
relationshipNames.push('type');
relationshipNames.push('department');
relationshipNames.push('users');

@Injectable()
export class CustomerService {
  logger = new Logger('CustomerService');

  constructor(
    @InjectRepository(CustomerRepository) private customerRepository: CustomerRepository,
    private readonly departmentService: DepartmentService
  ) {}

  async findById(id: string): Promise<Customer | undefined> {
    const options = { relations: relationshipNames };
    return await this.customerRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Customer>): Promise<Customer | undefined> {
    return await this.customerRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Customer>, currentUser: User): Promise<[Customer[], number]> {
    let departmentVisible = [];
    console.log(currentUser)
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id)
      departmentVisible.push(currentUser.department.id);
    }
    console.log(departmentVisible)
    options.where = {
      department: In(departmentVisible)
    }
    options.relations = relationshipNames;
    return await this.customerRepository.findAndCount(options);
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
