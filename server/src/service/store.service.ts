import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindManyOptions, FindOneOptions, In } from 'typeorm';
import Store from '../domain/store.entity';
import { StoreRepository } from '../repository/store.repository';
import { Request, Response } from 'express';

const relationshipNames = [];
relationshipNames.push('department');

@Injectable()
export class StoreService {
  logger = new Logger('StoreService');

  constructor(@InjectRepository(StoreRepository) private storeRepository: StoreRepository) {}

  async findById(id: string): Promise<Store | undefined> {
    const options = { relations: relationshipNames };
    return await this.storeRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Store>): Promise<Store | undefined> {
    return await this.storeRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Store>, filter = {}, departmentVisible = []): Promise<[Store[], number]> {
    let queryString = '';
    Object.keys(filter).forEach((item, index) => {
        queryString += `Store.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'OR '}`;
    });    
    let andQueryString = '';
    if (departmentVisible.length > 0) {
        andQueryString += ` ${andQueryString.length === 0? "":" AND "} Store.department IN ${JSON.stringify(departmentVisible)
            .replace('[', '(')
            .replace(']', ')')}`;
    }
    const cacheKeyBuilder = `get_Stores_department_${departmentVisible.join(',')}_endDate_${filter['endDate'] || ''}startDate${filter['startDate'] || ''}_filter_${JSON.stringify(filter)}_skip_${options.skip}_${options.take}_Store.${Object.keys(options.order)[0] ||
        'createdDate'}_${options.order[Object.keys(options.order)[0]] || 'DESC'}`;
    const queryBuilder = this.storeRepository
        .createQueryBuilder('Store')
        .leftJoinAndSelect('Store.department', 'department')
        .cache(cacheKeyBuilder, 604800)
        .where(andQueryString)
        .orderBy(`Store.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
        .skip(options.skip)
        .take(options.take);

    const count = this.storeRepository
        .createQueryBuilder('Store')
        .where(andQueryString)
        .orderBy(`Store.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
        .skip(options.skip)
        .take(options.take)
        .cache(
            `cache_count_get_Stores_department_${JSON.stringify(departmentVisible)}_filter_${JSON.stringify(filter)}`
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

  async save(store: Store): Promise<Store | undefined> {
    return await this.storeRepository.save(store);
  }

  async update(store: Store): Promise<Store | undefined> {
    return await this.save(store);
  }

  async delete(store: Store): Promise<Store | undefined> {
    return await this.storeRepository.remove(store);
  }
}
