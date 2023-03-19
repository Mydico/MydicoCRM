import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Brackets, FindManyOptions, FindOneOptions } from 'typeorm';
import StoreHistory from '../domain/store-history.entity';
import { StoreHistoryRepository } from '../repository/store-history.repository';
import Cache from 'cache-manager';
const relationshipNames = [];
relationshipNames.push('product');
relationshipNames.push('store');

@Injectable()
export class StoreHistoryService {
  logger = new Logger('StoreHistoryService');

  constructor(
    @InjectRepository(StoreHistoryRepository) private storeHistoryRepository: StoreHistoryRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async findById(id: string): Promise<StoreHistory | undefined> {
    const options = { relations: relationshipNames };
    return await this.storeHistoryRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<StoreHistory>): Promise<StoreHistory | undefined> {
    return await this.storeHistoryRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<StoreHistory>, filter = {}, departmentVisible = []): Promise<[StoreHistory[], number]> {
    let queryString = '';
    let andQueryString = '';
    const paramsObject: any = {};

    if (departmentVisible.length > 0) {
      andQueryString += ` ${andQueryString.length === 0 ? '' : ' AND '} StoreHistory.department IN (:...departments)`;
    }
    paramsObject.departments = departmentVisible;
    if (filter['endDate'] && filter['startDate']) {
      andQueryString += ` ${
        andQueryString.length === 0 ? '' : ' AND '
      }  StoreHistory.createdDate  >= :startDate AND  StoreHistory.createdDate <= :endDate`;
    }
    (paramsObject.startDate = filter['startDate']), (paramsObject.endDate = filter['endDate'] + ' 23:59:59'), delete filter['startDate'];
    delete filter['endDate'];
    Object.keys(filter).forEach((item, index) => {
      if (item === 'volume') {
        queryString += `product.volume like :volume ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
        paramsObject.volume = `%${filter[item]}%`;
      } else if (item === 'productName') {
        queryString += `product.name like :name ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
        paramsObject.name = `%${filter[item].includes('%') ? filter[item].split('%').join('\\%') : filter[item]}%`;
      } else {
        queryString += `StoreHistory.${item} like :${filter[item]} ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
        paramsObject[item] = `%${filter[item]}%`;
      }
    });
    const queryBuilder = this.storeHistoryRepository
      .createQueryBuilder('StoreHistory')
      .leftJoinAndSelect('StoreHistory.product', 'product')
      .leftJoinAndSelect('StoreHistory.store', 'store')
      .where(andQueryString, paramsObject)
      .orderBy(`StoreHistory.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take);

    // const count = this.storeHistoryRepository
    //   .createQueryBuilder('StoreHistory')
    //   .leftJoinAndSelect('StoreHistory.product', 'product')
    //   .where(andQueryString)
    //   .orderBy(`StoreHistory.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
    //   .skip(options.skip)
    //   .take(options.take);
    if (queryString) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          sqb.where(queryString);
        })
      );
      // count.andWhere(
      //   new Brackets(sqb => {
      //     sqb.where(queryString);
      //   })
      // );
    }
    const cacheKey = queryBuilder.getQueryAndParameters().toString();
    const cachedQuery = await this.cacheManager.get(cacheKey);
    if (cachedQuery) {
      return cachedQuery;
    }

    const result = await queryBuilder.getManyAndCount();
    await this.cacheManager.set(cacheKey, result, {ttl: 60 * 60 * 1000});
    return result;

    // options.cache = 3600000
  }

  async save(storeHistory: StoreHistory): Promise<StoreHistory | undefined> {
    return await this.storeHistoryRepository.save(storeHistory);
  }

  async saveMany(storeHistories: StoreHistory[]): Promise<StoreHistory[] | undefined> {
    return await this.storeHistoryRepository.save(storeHistories);
  }

  async update(storeHistory: StoreHistory): Promise<StoreHistory | undefined> {
    return await this.save(storeHistory);
  }

  async delete(storeHistory: StoreHistory): Promise<StoreHistory | undefined> {
    return await this.storeHistoryRepository.remove(storeHistory);
  }
}
