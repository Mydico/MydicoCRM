import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblProductQuantityController } from '../web/rest/tbl-product-quantity.controller';
import { TblProductQuantityRepository } from '../repository/tbl-product-quantity.repository';
import { TblProductQuantityService } from '../service/tbl-product-quantity.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblProductQuantityRepository])],
  controllers: [TblProductQuantityController],
  providers: [TblProductQuantityService],
  exports: [TblProductQuantityService]
})
export class TblProductQuantityModule {}
