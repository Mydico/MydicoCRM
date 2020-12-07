import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblCityController } from '../web/rest/tbl-city.controller';
import { TblCityRepository } from '../repository/tbl-city.repository';
import { TblCityService } from '../service/tbl-city.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblCityRepository])],
  controllers: [TblCityController],
  providers: [TblCityService],
  exports: [TblCityService]
})
export class TblCityModule {}
