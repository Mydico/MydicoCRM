import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblProductGroupMapController } from '../web/rest/tbl-product-group-map.controller';
import { TblProductGroupMapRepository } from '../repository/tbl-product-group-map.repository';
import { TblProductGroupMapService } from '../service/tbl-product-group-map.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblProductGroupMapRepository])],
  controllers: [TblProductGroupMapController],
  providers: [TblProductGroupMapService],
  exports: [TblProductGroupMapService]
})
export class TblProductGroupMapModule {}
