import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblDistrict from '../domain/tbl-district.entity';
import { TblDistrictRepository } from '../repository/tbl-district.repository';

const relationshipNames = [];
relationshipNames.push('city');

@Injectable()
export class TblDistrictService {
  logger = new Logger('TblDistrictService');

  constructor(@InjectRepository(TblDistrictRepository) private tblDistrictRepository: TblDistrictRepository) {}

  async findById(id: string): Promise<TblDistrict | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblDistrictRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblDistrict>): Promise<TblDistrict | undefined> {
    return await this.tblDistrictRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblDistrict>): Promise<[TblDistrict[], number]> {
    options.relations = relationshipNames;
    return await this.tblDistrictRepository.findAndCount(options);
  }

  async save(tblDistrict: TblDistrict): Promise<TblDistrict | undefined> {
    return await this.tblDistrictRepository.save(tblDistrict);
  }

  async update(tblDistrict: TblDistrict): Promise<TblDistrict | undefined> {
    return await this.save(tblDistrict);
  }

  async delete(tblDistrict: TblDistrict): Promise<TblDistrict | undefined> {
    return await this.tblDistrictRepository.remove(tblDistrict);
  }
}
