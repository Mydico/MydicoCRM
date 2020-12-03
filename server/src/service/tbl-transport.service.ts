import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblTransport from '../domain/tbl-transport.entity';
import { TblTransportRepository } from '../repository/tbl-transport.repository';

const relationshipNames = [];

@Injectable()
export class TblTransportService {
  logger = new Logger('TblTransportService');

  constructor(@InjectRepository(TblTransportRepository) private tblTransportRepository: TblTransportRepository) {}

  async findById(id: string): Promise<TblTransport | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblTransportRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblTransport>): Promise<TblTransport | undefined> {
    return await this.tblTransportRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblTransport>): Promise<[TblTransport[], number]> {
    options.relations = relationshipNames;
    return await this.tblTransportRepository.findAndCount(options);
  }

  async save(tblTransport: TblTransport): Promise<TblTransport | undefined> {
    return await this.tblTransportRepository.save(tblTransport);
  }

  async update(tblTransport: TblTransport): Promise<TblTransport | undefined> {
    return await this.save(tblTransport);
  }

  async delete(tblTransport: TblTransport): Promise<TblTransport | undefined> {
    return await this.tblTransportRepository.remove(tblTransport);
  }
}
