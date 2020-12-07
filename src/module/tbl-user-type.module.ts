import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblUserTypeController } from '../web/rest/tbl-user-type.controller';
import { TblUserTypeRepository } from '../repository/tbl-user-type.repository';
import { TblUserTypeService } from '../service/tbl-user-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblUserTypeRepository])],
  controllers: [TblUserTypeController],
  providers: [TblUserTypeService],
  exports: [TblUserTypeService]
})
export class TblUserTypeModule {}
