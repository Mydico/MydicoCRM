import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from '../web/rest/product.controller';
import { ProductRepository } from '../repository/product.repository';
import { ProductService } from '../service/product.service';
import { ProductQuantityModule } from './product-quantity.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([ProductRepository]),
    ProductQuantityModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}
