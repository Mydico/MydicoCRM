import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleController } from '../web/rest/user-role.controller';
import { UserRoleRepository } from '../repository/user-role.repository';
import { UserRoleService } from '../service/user-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoleRepository])],
  controllers: [UserRoleController],
  providers: [UserRoleService],
  exports: [UserRoleService]
})
export class UserRoleModule {}
