import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblUserDeviceToken from '../domain/tbl-user-device-token.entity';
import { TblUserDeviceTokenRepository } from '../repository/tbl-user-device-token.repository';

const relationshipNames = [];

@Injectable()
export class TblUserDeviceTokenService {
  logger = new Logger('TblUserDeviceTokenService');

  constructor(@InjectRepository(TblUserDeviceTokenRepository) private tblUserDeviceTokenRepository: TblUserDeviceTokenRepository) {}

  async findById(id: string): Promise<TblUserDeviceToken | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblUserDeviceTokenRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblUserDeviceToken>): Promise<TblUserDeviceToken | undefined> {
    return await this.tblUserDeviceTokenRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblUserDeviceToken>): Promise<[TblUserDeviceToken[], number]> {
    options.relations = relationshipNames;
    return await this.tblUserDeviceTokenRepository.findAndCount(options);
  }

  async save(tblUserDeviceToken: TblUserDeviceToken): Promise<TblUserDeviceToken | undefined> {
    return await this.tblUserDeviceTokenRepository.save(tblUserDeviceToken);
  }

  async update(tblUserDeviceToken: TblUserDeviceToken): Promise<TblUserDeviceToken | undefined> {
    return await this.save(tblUserDeviceToken);
  }

  async delete(tblUserDeviceToken: TblUserDeviceToken): Promise<TblUserDeviceToken | undefined> {
    return await this.tblUserDeviceTokenRepository.remove(tblUserDeviceToken);
  }
}
