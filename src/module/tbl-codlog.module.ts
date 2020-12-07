import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblCodlogController } from '../web/rest/tbl-codlog.controller';
import { TblCodlogRepository } from '../repository/tbl-codlog.repository';
import { TblCodlogService } from '../service/tbl-codlog.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblCodlogRepository])],
  controllers: [TblCodlogController],
  providers: [TblCodlogService],
  exports: [TblCodlogService]
})
export class TblCodlogModule {}
