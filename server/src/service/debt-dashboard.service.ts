import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import DebtDashboard from '../domain/income-dashboard.entity';
import { DebtDashboardRepository } from '../repository/debt-dashboard.repository';

const relationshipNames = [];


@Injectable()
export class DebtDashboardService {
    logger = new Logger('DebtDashboardService');

    constructor(@InjectRepository(DebtDashboardRepository) private incomeDashboardRepository: DebtDashboardRepository) {}

    async findById(id: string): Promise<DebtDashboard | undefined> {
        const options = { relations: relationshipNames };
        return await this.incomeDashboardRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<DebtDashboard>): Promise<DebtDashboard | undefined> {
        return await this.incomeDashboardRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<DebtDashboard>): Promise<[DebtDashboard[], number]> {
        return await this.incomeDashboardRepository.findAndCount(options);
    }

    async save(incomeDashboard: DebtDashboard): Promise<DebtDashboard | undefined> {
        return await this.incomeDashboardRepository.save(incomeDashboard);
    }

    async update(incomeDashboard: DebtDashboard): Promise<DebtDashboard | undefined> {
        return await this.save(incomeDashboard);
    }

    async delete(incomeDashboard: DebtDashboard): Promise<DebtDashboard | undefined> {
        return await this.incomeDashboardRepository.remove(incomeDashboard);
    }
}
