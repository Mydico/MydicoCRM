import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblOrderPush from '../domain/tbl-order-push.entity';
import { TblOrderPushRepository } from '../repository/tbl-order-push.repository';

const relationshipNames = [];

@Injectable()
export class TblOrderPushService {
  logger = new Logger('TblOrderPushService');

  constructor(@InjectRepository(TblOrderPushRepository) private tblOrderPushRepository: TblOrderPushRepository) {}

  async findById(id: string): Promise<TblOrderPush | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblOrderPushRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblOrderPush>): Promise<TblOrderPush | undefined> {
    return await this.tblOrderPushRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblOrderPush>): Promise<[TblOrderPush[], number]> {
    options.relations = relationshipNames;
    return await this.tblOrderPushRepository.findAndCount(options);
  }

  async save(tblOrderPush: TblOrderPush): Promise<TblOrderPush | undefined> {
    return await this.tblOrderPushRepository.save(tblOrderPush);
  }

  async update(tblOrderPush: TblOrderPush): Promise<TblOrderPush | undefined> {
    return await this.save(tblOrderPush);
  }

  async delete(tblOrderPush: TblOrderPush): Promise<TblOrderPush | undefined> {
    return await this.tblOrderPushRepository.remove(tblOrderPush);
  }
}
