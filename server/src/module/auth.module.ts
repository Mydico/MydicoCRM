import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserModule } from '../module/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { UserJWTController } from '../web/rest/user.jwt.controller';
import { config } from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityRepository } from '../repository/authority.repository';
import * as redisStore from 'cache-manager-redis-store';
import { AuthController } from '../web/rest/auth.controller';
import { AccountController } from '../web/rest/account.controller';
import { UserSubscriber } from '../service/subscribers/user.subscriber';

@Module({
    imports: [
        CacheModule.register({
            isGlobal: true,
            store: redisStore,
            host: 'localhost',
            port: 6379
          }),
        TypeOrmModule.forFeature([AuthorityRepository]),
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: config['jhipster.security.authentication.jwt.base64-secret'],
            signOptions: { expiresIn: '300s' },
        }),
    ],
    controllers: [UserJWTController, AuthController, AccountController],
    providers: [AuthService, JwtStrategy, UserSubscriber],
    exports: [AuthService],
})
export class AuthModule {}
