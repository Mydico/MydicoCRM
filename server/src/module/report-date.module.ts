import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportDateController } from '../web/rest/report-date.controller';
import { ReportDateRepository } from '../repository/report-date.repository';
import { ReportDateService } from '../service/report-date.service';

@Module({
    imports: [TypeOrmModule.forFeature([ReportDateRepository])],
    controllers: [ReportDateController],
    providers: [ReportDateService],
    exports: [ReportDateService],
})
export class ReportDateModule {}
