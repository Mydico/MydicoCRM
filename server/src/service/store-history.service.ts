import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import StoreHistory from '../domain/store-history.entity';
import { StoreHistoryRepository } from '../repository/store-history.repository';

const relationshipNames = [];
relationshipNames.push('product');
relationshipNames.push('store');

@Injectable()
export class StoreHistoryService {
  logger = new Logger('StoreHistoryService');

  constructor(@InjectRepository(StoreHistoryRepository) private storeHistoryRepository: StoreHistoryRepository) {}

  async findById(id: string): Promise<StoreHistory | undefined> {
    const options = { relations: relationshipNames };
    return await this.storeHistoryRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<StoreHistory>): Promise<StoreHistory | undefined> {
    return await this.storeHistoryRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<StoreHistory>): Promise<[StoreHistory[], number]> {
    options.relations = relationshipNames;
    return await this.storeHistoryRepository.findAndCount(options);
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
