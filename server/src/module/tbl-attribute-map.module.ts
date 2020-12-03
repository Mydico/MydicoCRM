import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblAttributeMapController } from '../web/rest/tbl-attribute-map.controller';
import { TblAttributeMapRepository } from '../repository/tbl-attribute-map.repository';
import { TblAttributeMapService } from '../service/tbl-attribute-map.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblAttributeMapRepository])],
  controllers: [TblAttributeMapController],
  providers: [TblAttributeMapService],
  exports: [TblAttributeMapService]
})
export class TblAttributeMapModule {}
