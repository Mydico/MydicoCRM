import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblProductGroupController } from '../web/rest/tbl-product-group.controller';
import { TblProductGroupRepository } from '../repository/tbl-product-group.repository';
import { TblProductGroupService } from '../service/tbl-product-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblProductGroupRepository])],
  controllers: [TblProductGroupController],
  providers: [TblProductGroupService],
  exports: [TblProductGroupService]
})
export class TblProductGroupModule {}
