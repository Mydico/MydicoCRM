import { Module } from '@nestjs/common';
import { ReportController } from '../web/rest/report.controller';
import { ReportService } from '../service/report.service';
import { DepartmentModule } from './department.module';
import { OrderModule } from './order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from '../repository/order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRepository]), DepartmentModule,OrderModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService]
})
export class ReportModule {}
