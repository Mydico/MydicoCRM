import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblUserRoleController } from '../web/rest/tbl-user-role.controller';
import { TblUserRoleRepository } from '../repository/tbl-user-role.repository';
import { TblUserRoleService } from '../service/tbl-user-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblUserRoleRepository])],
  controllers: [TblUserRoleController],
  providers: [TblUserRoleService],
  exports: [TblUserRoleService]
})
export class TblUserRoleModule {}
