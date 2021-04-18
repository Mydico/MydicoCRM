import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import ReportDate from '../domain/report-date.entity';
import { ReportDateRepository } from '../repository/report-date.repository';

const relationshipNames = [];

@Injectable()
export class ReportDateService {
    logger = new Logger('ReportDateService');

    constructor(@InjectRepository(ReportDateRepository) private reportDateRepository: ReportDateRepository) {}

    async findById(id: string): Promise<ReportDate | undefined> {
        const options = { relations: relationshipNames };
        return await this.reportDateRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<ReportDate>): Promise<ReportDate | undefined> {
        return await this.reportDateRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<ReportDate>): Promise<[ReportDate[], number]> {
        options.relations = relationshipNames;
        return await this.reportDateRepository.findAndCount(options);
    }

    async save(reportDate: ReportDate): Promise<ReportDate | undefined> {
        return await this.reportDateRepository.save(reportDate);
    }

    async update(reportDate: ReportDate): Promise<ReportDate | undefined> {
        return await this.save(reportDate);
    }

    async delete(reportDate: ReportDate): Promise<ReportDate | undefined> {
        return await this.reportDateRepository.remove(reportDate);
    }
}
