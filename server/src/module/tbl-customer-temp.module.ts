import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblCustomerTempController } from '../web/rest/tbl-customer-temp.controller';
import { TblCustomerTempRepository } from '../repository/tbl-customer-temp.repository';
import { TblCustomerTempService } from '../service/tbl-customer-temp.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblCustomerTempRepository])],
  controllers: [TblCustomerTempController],
  providers: [TblCustomerTempService],
  exports: [TblCustomerTempService]
})
export class TblCustomerTempModule {}
