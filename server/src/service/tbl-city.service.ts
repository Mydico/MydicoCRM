import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblCity from '../domain/tbl-city.entity';
import { TblCityRepository } from '../repository/tbl-city.repository';

const relationshipNames = [];

@Injectable()
export class TblCityService {
  logger = new Logger('TblCityService');

  constructor(@InjectRepository(TblCityRepository) private tblCityRepository: TblCityRepository) {}

  async findById(id: string): Promise<TblCity | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblCityRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblCity>): Promise<TblCity | undefined> {
    return await this.tblCityRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblCity>): Promise<[TblCity[], number]> {
    options.relations = relationshipNames;
    return await this.tblCityRepository.findAndCount(options);
  }

  async save(tblCity: TblCity): Promise<TblCity | undefined> {
    return await this.tblCityRepository.save(tblCity);
  }

  async update(tblCity: TblCity): Promise<TblCity | undefined> {
    return await this.save(tblCity);
  }

  async delete(tblCity: TblCity): Promise<TblCity | undefined> {
    return await this.tblCityRepository.remove(tblCity);
  }
}
