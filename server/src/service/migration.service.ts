import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Migration from '../domain/migration.entity';
import { MigrationRepository } from '../repository/migration.repository';

const relationshipNames = [];

@Injectable()
export class MigrationService {
  logger = new Logger('MigrationService');

  constructor(@InjectRepository(MigrationRepository) private migrationRepository: MigrationRepository) {}

  async findById(id: string): Promise<Migration | undefined> {
    const options = { relations: relationshipNames };
    return await this.migrationRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Migration>): Promise<Migration | undefined> {
    return await this.migrationRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Migration>): Promise<[Migration[], number]> {
    options.relations = relationshipNames;
    return await this.migrationRepository.findAndCount(options);
  }

  async save(migration: Migration): Promise<Migration | undefined> {
    return await this.migrationRepository.save(migration);
  }

  async update(migration: Migration): Promise<Migration | undefined> {
    return await this.save(migration);
  }

  async delete(migration: Migration): Promise<Migration | undefined> {
    return await this.migrationRepository.remove(migration);
  }
}
