import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblOrderDetailsController } from '../web/rest/tbl-order-details.controller';
import { TblOrderDetailsRepository } from '../repository/tbl-order-details.repository';
import { TblOrderDetailsService } from '../service/tbl-order-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblOrderDetailsRepository])],
  controllers: [TblOrderDetailsController],
  providers: [TblOrderDetailsService],
  exports: [TblOrderDetailsService]
})
export class TblOrderDetailsModule {}
