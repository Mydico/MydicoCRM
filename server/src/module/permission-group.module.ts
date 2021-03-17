import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGroupController } from '../web/rest/permission-group.controller';
import { PermissionGroupRepository } from '../repository/permission-group.repository';
import { PermissionGroupService } from '../service/permission-group.service';
import { PermissionModule } from './permission.module';
import { RoleModule } from './role.module';
import { PermissionGroupAssociateModule } from './permission-group-associate.module';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionGroupRepository]),PermissionModule, RoleModule, PermissionGroupAssociateModule],
  controllers: [PermissionGroupController],
  providers: [PermissionGroupService],
  exports: [PermissionGroupService]
})
export class PermissionGroupModule {}
