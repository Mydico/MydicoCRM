import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Wards from '../domain/wards.entity';
import { WardsRepository } from '../repository/wards.repository';

const relationshipNames = [];
relationshipNames.push('district');

@Injectable()
export class WardsService {
  logger = new Logger('WardsService');

  constructor(@InjectRepository(WardsRepository) private wardsRepository: WardsRepository) {}

  async findById(id: string): Promise<Wards | undefined> {
    const options = { relations: relationshipNames };
    return await this.wardsRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Wards>): Promise<Wards | undefined> {
    return await this.wardsRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Wards>): Promise<[Wards[], number]> {
    options.relations = relationshipNames;
    return await this.wardsRepository.findAndCount(options);
  }

  async save(wards: Wards): Promise<Wards | undefined> {
    return await this.wardsRepository.save(wards);
  }

  async update(wards: Wards): Promise<Wards | undefined> {
    return await this.save(wards);
  }

  async delete(wards: Wards): Promise<Wards | undefined> {
    return await this.wardsRepository.remove(wards);
  }
}
