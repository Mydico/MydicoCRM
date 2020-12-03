import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblReportDateController } from '../web/rest/tbl-report-date.controller';
import { TblReportDateRepository } from '../repository/tbl-report-date.repository';
import { TblReportDateService } from '../service/tbl-report-date.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblReportDateRepository])],
  controllers: [TblReportDateController],
  providers: [TblReportDateService],
  exports: [TblReportDateService]
})
export class TblReportDateModule {}
