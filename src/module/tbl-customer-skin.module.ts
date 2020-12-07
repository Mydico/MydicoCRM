import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblCustomerSkinController } from '../web/rest/tbl-customer-skin.controller';
import { TblCustomerSkinRepository } from '../repository/tbl-customer-skin.repository';
import { TblCustomerSkinService } from '../service/tbl-customer-skin.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblCustomerSkinRepository])],
  controllers: [TblCustomerSkinController],
  providers: [TblCustomerSkinService],
  exports: [TblCustomerSkinService]
})
export class TblCustomerSkinModule {}
