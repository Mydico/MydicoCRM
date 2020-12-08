import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerCategoryController } from '../web/rest/customer-category.controller';
import { CustomerCategoryRepository } from '../repository/customer-category.repository';
import { CustomerCategoryService } from '../service/customer-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerCategoryRepository])],
  controllers: [CustomerCategoryController],
  providers: [CustomerCategoryService],
  exports: [CustomerCategoryService]
})
export class CustomerCategoryModule {}
