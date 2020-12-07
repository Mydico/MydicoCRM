import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblUserTeamController } from '../web/rest/tbl-user-team.controller';
import { TblUserTeamRepository } from '../repository/tbl-user-team.repository';
import { TblUserTeamService } from '../service/tbl-user-team.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblUserTeamRepository])],
  controllers: [TblUserTeamController],
  providers: [TblUserTeamService],
  exports: [TblUserTeamService]
})
export class TblUserTeamModule {}
