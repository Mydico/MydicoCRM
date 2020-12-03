import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblProductController } from '../web/rest/tbl-product.controller';
import { TblProductRepository } from '../repository/tbl-product.repository';
import { TblProductService } from '../service/tbl-product.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblProductRepository])],
  controllers: [TblProductController],
  providers: [TblProductService],
  exports: [TblProductService]
})
export class TblProductModule {}
