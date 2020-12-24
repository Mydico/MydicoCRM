import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import Customer from '../domain/customer.entity';
import { CustomerRepository } from '../repository/customer.repository';

const relationshipNames = [];
relationshipNames.push('city');
relationshipNames.push('district');
relationshipNames.push('ward');
relationshipNames.push('fanpage');
relationshipNames.push('skin');
relationshipNames.push('category');
relationshipNames.push('status');
relationshipNames.push('type');
relationshipNames.push('branch');
relationshipNames.push('request');
relationshipNames.push('users');

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

  increment_alphanumeric_str = str => {
    const numeric = str.match(/\d+$/) ? str.match(/\d+$/)[0] : '0';
    const prefix = numeric === '0' ? str : str.split(numeric)[0];

    const increment_string_num = str => {
      const inc = String(parseInt(str) + 1);
      return str.slice(0, str.length - inc.length) + inc;
    };

    return prefix + increment_string_num(numeric);
  };

  async findAndCount(options: FindManyOptions<Customer>): Promise<[Customer[], number]> {
    options.relations = relationshipNames;
    return await this.customerRepository.findAndCount(options);
  }

  async save(customer: Customer): Promise<Customer | undefined> {
    const foundedCustomer = await this.customerRepository.find({ code: Like(`%${customer.code}%`) });
    if (foundedCustomer.length > 0) {
      foundedCustomer.sort((a, b) => a.createdDate.valueOf() - b.createdDate.valueOf());
      const res = this.increment_alphanumeric_str(foundedCustomer[foundedCustomer.length - 1].code);
      customer.code = res;
    }
    return await this.customerRepository.save(customer);
  }

  async update(customer: Customer): Promise<Customer | undefined> {
    return await this.customerRepository.save(customer);
  }

  async delete(customer: Customer): Promise<Customer | undefined> {
    return await this.customerRepository.remove(customer);
  }
}
