import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTokenController } from '../web/rest/user-token.controller';
import { UserTokenRepository } from '../repository/user-token.repository';
import { UserTokenService } from '../service/user-token.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([UserTokenRepository])],
    controllers: [UserTokenController],
    providers: [UserTokenService],
    exports: [UserTokenService],
})
export class UserTokenModule {}
