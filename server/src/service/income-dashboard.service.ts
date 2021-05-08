import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import IncomeDashboard from '../domain/income-dashboard.entity';
import { IncomeDashboardRepository } from '../repository/income-dashboard.repository';

const relationshipNames = [];


@Injectable()
export class IncomeDashboardService {
    logger = new Logger('IncomeDashboardService');

    constructor(@InjectRepository(IncomeDashboardRepository) private incomeDashboardRepository: IncomeDashboardRepository) {}

    async findById(id: string): Promise<IncomeDashboard | undefined> {
        const options = { relations: relationshipNames };
        return await this.incomeDashboardRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<IncomeDashboard>): Promise<IncomeDashboard | undefined> {
        return await this.incomeDashboardRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<IncomeDashboard>): Promise<[IncomeDashboard[], number]> {
        return await this.incomeDashboardRepository.findAndCount(options);
    }

    async save(incomeDashboard: IncomeDashboard): Promise<IncomeDashboard | undefined> {
        return await this.incomeDashboardRepository.save(incomeDashboard);
    }

    async update(incomeDashboard: IncomeDashboard): Promise<IncomeDashboard | undefined> {
        return await this.save(incomeDashboard);
    }

    async delete(incomeDashboard: IncomeDashboard): Promise<IncomeDashboard | undefined> {
        return await this.incomeDashboardRepository.remove(incomeDashboard);
    }
}
