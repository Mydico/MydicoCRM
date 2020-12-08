import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNotifyController } from '../web/rest/user-notify.controller';
import { UserNotifyRepository } from '../repository/user-notify.repository';
import { UserNotifyService } from '../service/user-notify.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserNotifyRepository])],
  controllers: [UserNotifyController],
  providers: [UserNotifyService],
  exports: [UserNotifyService]
})
export class UserNotifyModule {}
