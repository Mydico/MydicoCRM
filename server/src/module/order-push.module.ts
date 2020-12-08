import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderPushController } from '../web/rest/order-push.controller';
import { OrderPushRepository } from '../repository/order-push.repository';
import { OrderPushService } from '../service/order-push.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderPushRepository])],
  controllers: [OrderPushController],
  providers: [OrderPushService],
  exports: [OrderPushService]
})
export class OrderPushModule {}
