import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleController } from '../web/rest/user-role.controller';
import { UserRoleRepository } from '../repository/user-role.repository';
import { UserRoleService } from '../service/user-role.service';
import { RoleModule } from './role.module';
import { AuthorityRepository } from '../repository/authority.repository';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([UserRoleRepository]),
    TypeOrmModule.forFeature([AuthorityRepository]),
    RoleModule
  ],
  controllers: [UserRoleController],
  providers: [UserRoleService],
  exports: [UserRoleService]
})
export class UserRoleModule {}
