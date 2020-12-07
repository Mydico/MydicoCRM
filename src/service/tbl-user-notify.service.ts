import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblUserNotify from '../domain/tbl-user-notify.entity';
import { TblUserNotifyRepository } from '../repository/tbl-user-notify.repository';

const relationshipNames = [];

@Injectable()
export class TblUserNotifyService {
  logger = new Logger('TblUserNotifyService');

  constructor(@InjectRepository(TblUserNotifyRepository) private tblUserNotifyRepository: TblUserNotifyRepository) {}

  async findById(id: string): Promise<TblUserNotify | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblUserNotifyRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblUserNotify>): Promise<TblUserNotify | undefined> {
    return await this.tblUserNotifyRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblUserNotify>): Promise<[TblUserNotify[], number]> {
    options.relations = relationshipNames;
    return await this.tblUserNotifyRepository.findAndCount(options);
  }

  async save(tblUserNotify: TblUserNotify): Promise<TblUserNotify | undefined> {
    return await this.tblUserNotifyRepository.save(tblUserNotify);
  }

  async update(tblUserNotify: TblUserNotify): Promise<TblUserNotify | undefined> {
    return await this.save(tblUserNotify);
  }

  async delete(tblUserNotify: TblUserNotify): Promise<TblUserNotify | undefined> {
    return await this.tblUserNotifyRepository.remove(tblUserNotify);
  }
}
