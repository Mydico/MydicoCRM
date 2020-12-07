import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblTransportLog from '../domain/tbl-transport-log.entity';
import { TblTransportLogRepository } from '../repository/tbl-transport-log.repository';

const relationshipNames = [];

@Injectable()
export class TblTransportLogService {
  logger = new Logger('TblTransportLogService');

  constructor(@InjectRepository(TblTransportLogRepository) private tblTransportLogRepository: TblTransportLogRepository) {}

  async findById(id: string): Promise<TblTransportLog | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblTransportLogRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblTransportLog>): Promise<TblTransportLog | undefined> {
    return await this.tblTransportLogRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblTransportLog>): Promise<[TblTransportLog[], number]> {
    options.relations = relationshipNames;
    return await this.tblTransportLogRepository.findAndCount(options);
  }

  async save(tblTransportLog: TblTransportLog): Promise<TblTransportLog | undefined> {
    return await this.tblTransportLogRepository.save(tblTransportLog);
  }

  async update(tblTransportLog: TblTransportLog): Promise<TblTransportLog | undefined> {
    return await this.save(tblTransportLog);
  }

  async delete(tblTransportLog: TblTransportLog): Promise<TblTransportLog | undefined> {
    return await this.tblTransportLogRepository.remove(tblTransportLog);
  }
}
