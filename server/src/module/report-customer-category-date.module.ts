import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportCustomerCategoryDateController } from '../web/rest/report-customer-category-date.controller';
import { ReportCustomerCategoryDateRepository } from '../repository/report-customer-category-date.repository';
import { ReportCustomerCategoryDateService } from '../service/report-customer-category-date.service';

@Module({
    imports: [TypeOrmModule.forFeature([ReportCustomerCategoryDateRepository])],
    controllers: [ReportCustomerCategoryDateController],
    providers: [ReportCustomerCategoryDateService],
    exports: [ReportCustomerCategoryDateService],
})
export class ReportCustomerCategoryDateModule {}
