import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblCustomerController } from '../web/rest/tbl-customer.controller';
import { TblCustomerRepository } from '../repository/tbl-customer.repository';
import { TblCustomerService } from '../service/tbl-customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblCustomerRepository])],
  controllers: [TblCustomerController],
  providers: [TblCustomerService],
  exports: [TblCustomerService]
})
export class TblCustomerModule {}
