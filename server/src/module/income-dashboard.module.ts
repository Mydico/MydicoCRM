import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeDashboardRepository } from '../repository/income-dashboard.repository';
import { IncomeDashboardService } from '../service/income-dashboard.service';
import { IncomeDashboardController } from '../web/rest/income-dashboard.controller';
import { DepartmentModule } from './department.module';

@Module({
  imports: [CacheModule.register(), TypeOrmModule.forFeature([IncomeDashboardRepository]), DepartmentModule],
  controllers: [IncomeDashboardController],
  providers: [IncomeDashboardService],
  exports: [IncomeDashboardService]
})
export class IncomeDashboardModule {}
