import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblOrderController } from '../web/rest/tbl-order.controller';
import { TblOrderRepository } from '../repository/tbl-order.repository';
import { TblOrderService } from '../service/tbl-order.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblOrderRepository])],
  controllers: [TblOrderController],
  providers: [TblOrderService],
  exports: [TblOrderService]
})
export class TblOrderModule {}
