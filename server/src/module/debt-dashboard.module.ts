import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtDashboardController } from '../web/rest/debt-dashboard.controller';
import { DebtDashboardRepository } from '../repository/debt-dashboard.repository';
import { DebtDashboardService } from '../service/debt-dashboard.service';
import { DepartmentModule } from './department.module';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([DebtDashboardRepository]),DepartmentModule],
    controllers: [DebtDashboardController],
    providers: [DebtDashboardService],
    exports: [DebtDashboardService],
})
export class DebtDashboardModule {}
