import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblOrderPushController } from '../web/rest/tbl-order-push.controller';
import { TblOrderPushRepository } from '../repository/tbl-order-push.repository';
import { TblOrderPushService } from '../service/tbl-order-push.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblOrderPushRepository])],
  controllers: [TblOrderPushController],
  providers: [TblOrderPushService],
  exports: [TblOrderPushService]
})
export class TblOrderPushModule {}
