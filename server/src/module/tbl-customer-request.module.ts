import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblCustomerRequestController } from '../web/rest/tbl-customer-request.controller';
import { TblCustomerRequestRepository } from '../repository/tbl-customer-request.repository';
import { TblCustomerRequestService } from '../service/tbl-customer-request.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblCustomerRequestRepository])],
  controllers: [TblCustomerRequestController],
  providers: [TblCustomerRequestService],
  exports: [TblCustomerRequestService]
})
export class TblCustomerRequestModule {}
