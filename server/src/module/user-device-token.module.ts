import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDeviceTokenController } from '../web/rest/user-device-token.controller';
import { UserDeviceTokenRepository } from '../repository/user-device-token.repository';
import { UserDeviceTokenService } from '../service/user-device-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserDeviceTokenRepository])],
  controllers: [UserDeviceTokenController],
  providers: [UserDeviceTokenService],
  exports: [UserDeviceTokenService]
})
export class UserDeviceTokenModule {}
