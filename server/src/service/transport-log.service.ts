import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TransportLog from '../domain/transport-log.entity';
import { TransportLogRepository } from '../repository/transport-log.repository';

const relationshipNames = [];

@Injectable()
export class TransportLogService {
  logger = new Logger('TransportLogService');

  constructor(@InjectRepository(TransportLogRepository) private transportLogRepository: TransportLogRepository) {}

  async findById(id: string): Promise<TransportLog | undefined> {
    const options = { relations: relationshipNames };
    return await this.transportLogRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TransportLog>): Promise<TransportLog | undefined> {
    return await this.transportLogRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TransportLog>): Promise<[TransportLog[], number]> {
    options.relations = relationshipNames;
    return await this.transportLogRepository.findAndCount(options);
  }

  async save(transportLog: TransportLog): Promise<TransportLog | undefined> {
    return await this.transportLogRepository.save(transportLog);
  }

  async update(transportLog: TransportLog): Promise<TransportLog | undefined> {
    return await this.save(transportLog);
  }

  async delete(transportLog: TransportLog): Promise<TransportLog | undefined> {
    return await this.transportLogRepository.remove(transportLog);
  }
}
