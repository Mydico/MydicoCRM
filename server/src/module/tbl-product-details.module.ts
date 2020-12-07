import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblProductDetailsController } from '../web/rest/tbl-product-details.controller';
import { TblProductDetailsRepository } from '../repository/tbl-product-details.repository';
import { TblProductDetailsService } from '../service/tbl-product-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblProductDetailsRepository])],
  controllers: [TblProductDetailsController],
  providers: [TblProductDetailsService],
  exports: [TblProductDetailsService]
})
export class TblProductDetailsModule {}
