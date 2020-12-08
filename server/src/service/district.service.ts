import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import District from '../domain/district.entity';
import { DistrictRepository } from '../repository/district.repository';

const relationshipNames = [];
relationshipNames.push('city');

@Injectable()
export class DistrictService {
  logger = new Logger('DistrictService');

  constructor(@InjectRepository(DistrictRepository) private districtRepository: DistrictRepository) {}

  async findById(id: string): Promise<District | undefined> {
    const options = { relations: relationshipNames };
    return await this.districtRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<District>): Promise<District | undefined> {
    return await this.districtRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<District>): Promise<[District[], number]> {
    options.relations = relationshipNames;
    return await this.districtRepository.findAndCount(options);
  }

  async save(district: District): Promise<District | undefined> {
    return await this.districtRepository.save(district);
  }

  async update(district: District): Promise<District | undefined> {
    return await this.save(district);
  }

  async delete(district: District): Promise<District | undefined> {
    return await this.districtRepository.remove(district);
  }
}
