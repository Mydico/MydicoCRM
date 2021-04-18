import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import ReportCustomerCategoryDate from '../domain/report-customer-category-date.entity';
import { ReportCustomerCategoryDateRepository } from '../repository/report-customer-category-date.repository';

const relationshipNames = [];

@Injectable()
export class ReportCustomerCategoryDateService {
    logger = new Logger('ReportCustomerCategoryDateService');

    constructor(
        @InjectRepository(ReportCustomerCategoryDateRepository)
        private reportCustomerCategoryDateRepository: ReportCustomerCategoryDateRepository
    ) {}

    async findById(id: string): Promise<ReportCustomerCategoryDate | undefined> {
        const options = { relations: relationshipNames };
        return await this.reportCustomerCategoryDateRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<ReportCustomerCategoryDate>): Promise<ReportCustomerCategoryDate | undefined> {
        return await this.reportCustomerCategoryDateRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<ReportCustomerCategoryDate>): Promise<[ReportCustomerCategoryDate[], number]> {
        options.relations = relationshipNames;
        return await this.reportCustomerCategoryDateRepository.findAndCount(options);
    }

    async save(reportCustomerCategoryDate: ReportCustomerCategoryDate): Promise<ReportCustomerCategoryDate | undefined> {
        return await this.reportCustomerCategoryDateRepository.save(reportCustomerCategoryDate);
    }

    async update(reportCustomerCategoryDate: ReportCustomerCategoryDate): Promise<ReportCustomerCategoryDate | undefined> {
        return await this.save(reportCustomerCategoryDate);
    }

    async delete(reportCustomerCategoryDate: ReportCustomerCategoryDate): Promise<ReportCustomerCategoryDate | undefined> {
        return await this.reportCustomerCategoryDateRepository.remove(reportCustomerCategoryDate);
    }
}
