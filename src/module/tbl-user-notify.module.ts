import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblUserNotifyController } from '../web/rest/tbl-user-notify.controller';
import { TblUserNotifyRepository } from '../repository/tbl-user-notify.repository';
import { TblUserNotifyService } from '../service/tbl-user-notify.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblUserNotifyRepository])],
  controllers: [TblUserNotifyController],
  providers: [TblUserNotifyService],
  exports: [TblUserNotifyService]
})
export class TblUserNotifyModule {}
