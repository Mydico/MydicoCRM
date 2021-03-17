import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import PermissionGroupHistory from '../domain/permission-group-history.entity';
import { PermissionGroupHistoryRepository } from '../repository/permission-group-history.repository';

const relationshipNames = [];

@Injectable()
export class PermissionGroupHistoryService {
  logger = new Logger('PermissionGroupHistoryService');

  constructor(
    @InjectRepository(PermissionGroupHistoryRepository) private permissionGroupHistoryRepository: PermissionGroupHistoryRepository
  ) {}

  async findById(id: string): Promise<PermissionGroupHistory | undefined> {
    const options = { relations: relationshipNames };
    return await this.permissionGroupHistoryRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<PermissionGroupHistory>): Promise<PermissionGroupHistory | undefined> {
    return await this.permissionGroupHistoryRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<PermissionGroupHistory>): Promise<[PermissionGroupHistory[], number]> {
    options.relations = relationshipNames;
    return await this.permissionGroupHistoryRepository.findAndCount(options);
  }

  async save(permissionGroupHistory: PermissionGroupHistory): Promise<PermissionGroupHistory | undefined> {
    return await this.permissionGroupHistoryRepository.save(permissionGroupHistory);
  }

  async update(permissionGroupHistory: PermissionGroupHistory): Promise<PermissionGroupHistory | undefined> {
    return await this.save(permissionGroupHistory);
  }

  async delete(permissionGroupHistory: PermissionGroupHistory): Promise<PermissionGroupHistory | undefined> {
    return await this.permissionGroupHistoryRepository.remove(permissionGroupHistory);
  }
}
