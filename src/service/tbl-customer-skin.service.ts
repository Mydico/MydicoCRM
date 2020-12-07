import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblCustomerSkin from '../domain/tbl-customer-skin.entity';
import { TblCustomerSkinRepository } from '../repository/tbl-customer-skin.repository';

const relationshipNames = [];

@Injectable()
export class TblCustomerSkinService {
  logger = new Logger('TblCustomerSkinService');

  constructor(@InjectRepository(TblCustomerSkinRepository) private tblCustomerSkinRepository: TblCustomerSkinRepository) {}

  async findById(id: string): Promise<TblCustomerSkin | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblCustomerSkinRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblCustomerSkin>): Promise<TblCustomerSkin | undefined> {
    return await this.tblCustomerSkinRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblCustomerSkin>): Promise<[TblCustomerSkin[], number]> {
    options.relations = relationshipNames;
    return await this.tblCustomerSkinRepository.findAndCount(options);
  }

  async save(tblCustomerSkin: TblCustomerSkin): Promise<TblCustomerSkin | undefined> {
    return await this.tblCustomerSkinRepository.save(tblCustomerSkin);
  }

  async update(tblCustomerSkin: TblCustomerSkin): Promise<TblCustomerSkin | undefined> {
    return await this.save(tblCustomerSkin);
  }

  async delete(tblCustomerSkin: TblCustomerSkin): Promise<TblCustomerSkin | undefined> {
    return await this.tblCustomerSkinRepository.remove(tblCustomerSkin);
  }
}
