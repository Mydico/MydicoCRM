import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblCustomerMapController } from '../web/rest/tbl-customer-map.controller';
import { TblCustomerMapRepository } from '../repository/tbl-customer-map.repository';
import { TblCustomerMapService } from '../service/tbl-customer-map.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblCustomerMapRepository])],
  controllers: [TblCustomerMapController],
  providers: [TblCustomerMapService],
  exports: [TblCustomerMapService]
})
export class TblCustomerMapModule {}
