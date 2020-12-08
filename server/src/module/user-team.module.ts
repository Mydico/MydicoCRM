import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTeamController } from '../web/rest/user-team.controller';
import { UserTeamRepository } from '../repository/user-team.repository';
import { UserTeamService } from '../service/user-team.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserTeamRepository])],
  controllers: [UserTeamController],
  providers: [UserTeamService],
  exports: [UserTeamService]
})
export class UserTeamModule {}
