import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblReportCustomerCategoryDate from '../domain/tbl-report-customer-category-date.entity';
import { TblReportCustomerCategoryDateRepository } from '../repository/tbl-report-customer-category-date.repository';

const relationshipNames = [];

@Injectable()
export class TblReportCustomerCategoryDateService {
  logger = new Logger('TblReportCustomerCategoryDateService');

  constructor(
    @InjectRepository(TblReportCustomerCategoryDateRepository)
    private tblReportCustomerCategoryDateRepository: TblReportCustomerCategoryDateRepository
  ) {}

  async findById(id: string): Promise<TblReportCustomerCategoryDate | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblReportCustomerCategoryDateRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblReportCustomerCategoryDate>): Promise<TblReportCustomerCategoryDate | undefined> {
    return await this.tblReportCustomerCategoryDateRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblReportCustomerCategoryDate>): Promise<[TblReportCustomerCategoryDate[], number]> {
    options.relations = relationshipNames;
    return await this.tblReportCustomerCategoryDateRepository.findAndCount(options);
  }

  async save(tblReportCustomerCategoryDate: TblReportCustomerCategoryDate): Promise<TblReportCustomerCategoryDate | undefined> {
    return await this.tblReportCustomerCategoryDateRepository.save(tblReportCustomerCategoryDate);
  }

  async update(tblReportCustomerCategoryDate: TblReportCustomerCategoryDate): Promise<TblReportCustomerCategoryDate | undefined> {
    return await this.save(tblReportCustomerCategoryDate);
  }

  async delete(tblReportCustomerCategoryDate: TblReportCustomerCategoryDate): Promise<TblReportCustomerCategoryDate | undefined> {
    return await this.tblReportCustomerCategoryDateRepository.remove(tblReportCustomerCategoryDate);
  }
}
