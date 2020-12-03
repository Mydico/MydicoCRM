import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblUserController } from '../web/rest/tbl-user.controller';
import { TblUserRepository } from '../repository/tbl-user.repository';
import { TblUserService } from '../service/tbl-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblUserRepository])],
  controllers: [TblUserController],
  providers: [TblUserService],
  exports: [TblUserService]
})
export class TblUserModule {}
