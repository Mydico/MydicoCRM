import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGroupAssociateController } from '../web/rest/permission-group-associate.controller';
import { PermissionGroupAssociateRepository } from '../repository/permission-group-associate.repository';
import { PermissionGroupAssociateService } from '../service/permission-group-associate.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionGroupAssociateRepository])],
  controllers: [PermissionGroupAssociateController],
  providers: [PermissionGroupAssociateService],
  exports: [PermissionGroupAssociateService]
})
export class PermissionGroupAssociateModule {}
