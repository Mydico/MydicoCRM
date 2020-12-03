import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblUserDeviceTokenController } from '../web/rest/tbl-user-device-token.controller';
import { TblUserDeviceTokenRepository } from '../repository/tbl-user-device-token.repository';
import { TblUserDeviceTokenService } from '../service/tbl-user-device-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblUserDeviceTokenRepository])],
  controllers: [TblUserDeviceTokenController],
  providers: [TblUserDeviceTokenService],
  exports: [TblUserDeviceTokenService]
})
export class TblUserDeviceTokenModule {}
