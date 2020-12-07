import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblCustomerCategoryController } from '../web/rest/tbl-customer-category.controller';
import { TblCustomerCategoryRepository } from '../repository/tbl-customer-category.repository';
import { TblCustomerCategoryService } from '../service/tbl-customer-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblCustomerCategoryRepository])],
  controllers: [TblCustomerCategoryController],
  providers: [TblCustomerCategoryService],
  exports: [TblCustomerCategoryService]
})
export class TblCustomerCategoryModule {}
