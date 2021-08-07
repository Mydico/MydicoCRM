import { Module } from '@nestjs/common';
import { ReportController } from '../web/rest/report.controller';
import { ReportService } from '../service/report.service';
import { DepartmentModule } from './department.module';
import { OrderModule } from './order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from '../repository/order.repository';
import { OrderDetailsRepository } from '../repository/order-details.repository';
import { CustomerRepository } from '../repository/customer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRepository, OrderDetailsRepository, CustomerRepository]), DepartmentModule,OrderModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService]
})
export class ReportModule {}
