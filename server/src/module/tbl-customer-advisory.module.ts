import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblCustomerAdvisoryController } from '../web/rest/tbl-customer-advisory.controller';
import { TblCustomerAdvisoryRepository } from '../repository/tbl-customer-advisory.repository';
import { TblCustomerAdvisoryService } from '../service/tbl-customer-advisory.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblCustomerAdvisoryRepository])],
  controllers: [TblCustomerAdvisoryController],
  providers: [TblCustomerAdvisoryService],
  exports: [TblCustomerAdvisoryService]
})
export class TblCustomerAdvisoryModule {}
