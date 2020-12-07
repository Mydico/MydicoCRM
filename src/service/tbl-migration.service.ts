import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblMigration from '../domain/tbl-migration.entity';
import { TblMigrationRepository } from '../repository/tbl-migration.repository';

const relationshipNames = [];

@Injectable()
export class TblMigrationService {
  logger = new Logger('TblMigrationService');

  constructor(@InjectRepository(TblMigrationRepository) private tblMigrationRepository: TblMigrationRepository) {}

  async findById(id: string): Promise<TblMigration | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblMigrationRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblMigration>): Promise<TblMigration | undefined> {
    return await this.tblMigrationRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblMigration>): Promise<[TblMigration[], number]> {
    options.relations = relationshipNames;
    return await this.tblMigrationRepository.findAndCount(options);
  }

  async save(tblMigration: TblMigration): Promise<TblMigration | undefined> {
    return await this.tblMigrationRepository.save(tblMigration);
  }

  async update(tblMigration: TblMigration): Promise<TblMigration | undefined> {
    return await this.save(tblMigration);
  }

  async delete(tblMigration: TblMigration): Promise<TblMigration | undefined> {
    return await this.tblMigrationRepository.remove(tblMigration);
  }
}
