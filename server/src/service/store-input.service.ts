import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import StoreInput from '../domain/store-input.entity';
import { StoreInputRepository } from '../repository/store-input.repository';

const relationshipNames = [];
relationshipNames.push('storeOutput');
relationshipNames.push('storeInput');

@Injectable()
export class StoreInputService {
  logger = new Logger('StoreInputService');

  constructor(@InjectRepository(StoreInputRepository) private storeInputRepository: StoreInputRepository) {}

  async findById(id: string): Promise<StoreInput | undefined> {
    const options = { relations: relationshipNames };
    return await this.storeInputRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<StoreInput>): Promise<StoreInput | undefined> {
    return await this.storeInputRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<StoreInput>): Promise<[StoreInput[], number]> {
    options.relations = relationshipNames;
    return await this.storeInputRepository.findAndCount(options);
  }

  async save(storeInput: StoreInput): Promise<StoreInput | undefined> {
    return await this.storeInputRepository.save(storeInput);
  }

  async update(storeInput: StoreInput): Promise<StoreInput | undefined> {
    return await this.save(storeInput);
  }

  async delete(storeInput: StoreInput): Promise<StoreInput | undefined> {
    return await this.storeInputRepository.remove(storeInput);
  }
}
