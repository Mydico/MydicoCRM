import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblDistrictController } from '../web/rest/tbl-district.controller';
import { TblDistrictRepository } from '../repository/tbl-district.repository';
import { TblDistrictService } from '../service/tbl-district.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblDistrictRepository])],
  controllers: [TblDistrictController],
  providers: [TblDistrictService],
  exports: [TblDistrictService]
})
export class TblDistrictModule {}
