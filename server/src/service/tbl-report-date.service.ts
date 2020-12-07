import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblReportDate from '../domain/tbl-report-date.entity';
import { TblReportDateRepository } from '../repository/tbl-report-date.repository';

const relationshipNames = [];

@Injectable()
export class TblReportDateService {
  logger = new Logger('TblReportDateService');

  constructor(@InjectRepository(TblReportDateRepository) private tblReportDateRepository: TblReportDateRepository) {}

  async findById(id: string): Promise<TblReportDate | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblReportDateRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblReportDate>): Promise<TblReportDate | undefined> {
    return await this.tblReportDateRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblReportDate>): Promise<[TblReportDate[], number]> {
    options.relations = relationshipNames;
    return await this.tblReportDateRepository.findAndCount(options);
  }

  async save(tblReportDate: TblReportDate): Promise<TblReportDate | undefined> {
    return await this.tblReportDateRepository.save(tblReportDate);
  }

  async update(tblReportDate: TblReportDate): Promise<TblReportDate | undefined> {
    return await this.save(tblReportDate);
  }

  async delete(tblReportDate: TblReportDate): Promise<TblReportDate | undefined> {
    return await this.tblReportDateRepository.remove(tblReportDate);
  }
}
