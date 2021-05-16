import { CacheModule, Module } from '@nestjs/common';
import { UserController } from '../web/rest/user.controller';
import { ManagementController } from '../web/rest/management.controller';
import { UserRepository } from '../repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../service/user.service';
import { RoleModule } from './role.module';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([UserRepository]), RoleModule],
    controllers: [UserController, ManagementController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
