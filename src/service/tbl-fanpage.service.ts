import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblFanpage from '../domain/tbl-fanpage.entity';
import { TblFanpageRepository } from '../repository/tbl-fanpage.repository';

const relationshipNames = [];

@Injectable()
export class TblFanpageService {
  logger = new Logger('TblFanpageService');

  constructor(@InjectRepository(TblFanpageRepository) private tblFanpageRepository: TblFanpageRepository) {}

  async findById(id: string): Promise<TblFanpage | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblFanpageRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblFanpage>): Promise<TblFanpage | undefined> {
    return await this.tblFanpageRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblFanpage>): Promise<[TblFanpage[], number]> {
    options.relations = relationshipNames;
    return await this.tblFanpageRepository.findAndCount(options);
  }

  async save(tblFanpage: TblFanpage): Promise<TblFanpage | undefined> {
    return await this.tblFanpageRepository.save(tblFanpage);
  }

  async update(tblFanpage: TblFanpage): Promise<TblFanpage | undefined> {
    return await this.save(tblFanpage);
  }

  async delete(tblFanpage: TblFanpage): Promise<TblFanpage | undefined> {
    return await this.tblFanpageRepository.remove(tblFanpage);
  }
}
