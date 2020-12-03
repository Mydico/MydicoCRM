import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblOrderDetails from '../domain/tbl-order-details.entity';
import { TblOrderDetailsRepository } from '../repository/tbl-order-details.repository';

const relationshipNames = [];
relationshipNames.push('order');

@Injectable()
export class TblOrderDetailsService {
  logger = new Logger('TblOrderDetailsService');

  constructor(@InjectRepository(TblOrderDetailsRepository) private tblOrderDetailsRepository: TblOrderDetailsRepository) {}

  async findById(id: string): Promise<TblOrderDetails | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblOrderDetailsRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblOrderDetails>): Promise<TblOrderDetails | undefined> {
    return await this.tblOrderDetailsRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblOrderDetails>): Promise<[TblOrderDetails[], number]> {
    options.relations = relationshipNames;
    return await this.tblOrderDetailsRepository.findAndCount(options);
  }

  async save(tblOrderDetails: TblOrderDetails): Promise<TblOrderDetails | undefined> {
    return await this.tblOrderDetailsRepository.save(tblOrderDetails);
  }

  async update(tblOrderDetails: TblOrderDetails): Promise<TblOrderDetails | undefined> {
    return await this.save(tblOrderDetails);
  }

  async delete(tblOrderDetails: TblOrderDetails): Promise<TblOrderDetails | undefined> {
    return await this.tblOrderDetailsRepository.remove(tblOrderDetails);
  }
}
