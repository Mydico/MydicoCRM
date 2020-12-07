import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblCustomerTypeController } from '../web/rest/tbl-customer-type.controller';
import { TblCustomerTypeRepository } from '../repository/tbl-customer-type.repository';
import { TblCustomerTypeService } from '../service/tbl-customer-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblCustomerTypeRepository])],
  controllers: [TblCustomerTypeController],
  providers: [TblCustomerTypeService],
  exports: [TblCustomerTypeService]
})
export class TblCustomerTypeModule {}
