import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import StoreInputDetails from '../domain/store-input-details.entity';
import { StoreInputDetailsRepository } from '../repository/store-input-details.repository';

const relationshipNames = [];
relationshipNames.push('store');
relationshipNames.push('product');

@Injectable()
export class StoreInputDetailsService {
  logger = new Logger('StoreInputDetailsService');

  constructor(@InjectRepository(StoreInputDetailsRepository) private storeInputDetailsRepository: StoreInputDetailsRepository) {}

  async findById(id: string): Promise<StoreInputDetails | undefined> {
    const options = { relations: relationshipNames };
    return await this.storeInputDetailsRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<StoreInputDetails>): Promise<StoreInputDetails | undefined> {
    return await this.storeInputDetailsRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<StoreInputDetails>): Promise<[StoreInputDetails[], number]> {
    options.relations = relationshipNames;
    return await this.storeInputDetailsRepository.findAndCount(options);
  }

  async save(storeInputDetails: StoreInputDetails): Promise<StoreInputDetails | undefined> {
    return await this.storeInputDetailsRepository.save(storeInputDetails);
  }

  async saveMany(storeInputDetails: StoreInputDetails[]): Promise<StoreInputDetails[] | undefined> {
    return await this.storeInputDetailsRepository.save(storeInputDetails);
  }

  async update(storeInputDetails: StoreInputDetails): Promise<StoreInputDetails | undefined> {
    return await this.save(storeInputDetails);
  }

  async delete(storeInputDetails: StoreInputDetails): Promise<StoreInputDetails | undefined> {
    return await this.storeInputDetailsRepository.remove(storeInputDetails);
  }
}
