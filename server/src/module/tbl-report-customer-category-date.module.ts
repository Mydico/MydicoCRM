import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblReportCustomerCategoryDateController } from '../web/rest/tbl-report-customer-category-date.controller';
import { TblReportCustomerCategoryDateRepository } from '../repository/tbl-report-customer-category-date.repository';
import { TblReportCustomerCategoryDateService } from '../service/tbl-report-customer-category-date.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblReportCustomerCategoryDateRepository])],
  controllers: [TblReportCustomerCategoryDateController],
  providers: [TblReportCustomerCategoryDateService],
  exports: [TblReportCustomerCategoryDateService]
})
export class TblReportCustomerCategoryDateModule {}
