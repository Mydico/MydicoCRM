import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblCustomerStatusController } from '../web/rest/tbl-customer-status.controller';
import { TblCustomerStatusRepository } from '../repository/tbl-customer-status.repository';
import { TblCustomerStatusService } from '../service/tbl-customer-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblCustomerStatusRepository])],
  controllers: [TblCustomerStatusController],
  providers: [TblCustomerStatusService],
  exports: [TblCustomerStatusService]
})
export class TblCustomerStatusModule {}
