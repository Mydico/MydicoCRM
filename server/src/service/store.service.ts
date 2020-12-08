import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Store from '../domain/store.entity';
import { StoreRepository } from '../repository/store.repository';

const relationshipNames = [];
relationshipNames.push('city');
relationshipNames.push('district');
relationshipNames.push('wards');

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

  async findAndCount(options: FindManyOptions<Store>): Promise<[Store[], number]> {
    options.relations = relationshipNames;
    return await this.storeRepository.findAndCount(options);
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
