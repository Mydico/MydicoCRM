import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductGroupController } from '../web/rest/product-group.controller';
import { ProductGroupRepository } from '../repository/product-group.repository';
import { ProductGroupService } from '../service/product-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductGroupRepository])],
  controllers: [ProductGroupController],
  providers: [ProductGroupService],
  exports: [ProductGroupService]
})
export class ProductGroupModule {}
