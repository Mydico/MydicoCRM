import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductGroupMapController } from '../web/rest/product-group-map.controller';
import { ProductGroupMapRepository } from '../repository/product-group-map.repository';
import { ProductGroupMapService } from '../service/product-group-map.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductGroupMapRepository])],
  controllers: [ProductGroupMapController],
  providers: [ProductGroupMapService],
  exports: [ProductGroupMapService]
})
export class ProductGroupMapModule {}
