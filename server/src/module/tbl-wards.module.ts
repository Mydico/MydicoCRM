import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblWardsController } from '../web/rest/tbl-wards.controller';
import { TblWardsRepository } from '../repository/tbl-wards.repository';
import { TblWardsService } from '../service/tbl-wards.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblWardsRepository])],
  controllers: [TblWardsController],
  providers: [TblWardsService],
  exports: [TblWardsService]
})
export class TblWardsModule {}
