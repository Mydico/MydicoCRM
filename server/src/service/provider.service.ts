import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Provider from '../domain/provider.entity';
import { ProviderRepository } from '../repository/provider.repository';

const relationshipNames = [];

@Injectable()
export class ProviderService {
  logger = new Logger('ProviderService');

  constructor(@InjectRepository(ProviderRepository) private providerRepository: ProviderRepository) {}

  async findById(id: string): Promise<Provider | undefined> {
    const options = { relations: relationshipNames };
    return await this.providerRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Provider>): Promise<Provider | undefined> {
    return await this.providerRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Provider>): Promise<[Provider[], number]> {
    options.relations = relationshipNames;
    return await this.providerRepository.findAndCount(options);
  }

  async save(provider: Provider): Promise<Provider | undefined> {
    return await this.providerRepository.save(provider);
  }

  async update(provider: Provider): Promise<Provider | undefined> {
    return await this.save(provider);
  }

  async delete(provider: Provider): Promise<Provider | undefined> {
    return await this.providerRepository.remove(provider);
  }
}
