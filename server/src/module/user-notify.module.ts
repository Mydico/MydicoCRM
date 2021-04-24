import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNotifyController } from '../web/rest/user-notify.controller';
import { UserNotifyRepository } from '../repository/user-notify.repository';
import { UserNotifyService } from '../service/user-notify.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([UserNotifyRepository])],
    controllers: [UserNotifyController],
    providers: [UserNotifyService],
    exports: [UserNotifyService],
})
export class UserNotifyModule {}
