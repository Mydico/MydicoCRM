import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblCustomerCallController } from '../web/rest/tbl-customer-call.controller';
import { TblCustomerCallRepository } from '../repository/tbl-customer-call.repository';
import { TblCustomerCallService } from '../service/tbl-customer-call.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblCustomerCallRepository])],
  controllers: [TblCustomerCallController],
  providers: [TblCustomerCallService],
  exports: [TblCustomerCallService]
})
export class TblCustomerCallModule {}
