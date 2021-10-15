import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductQuantityController } from '../web/rest/product-quantity.controller';
import { ProductQuantityRepository } from '../repository/product-quantity.repository';
import { ProductQuantityService } from '../service/product-quantity.service';
import { ProductQuantitySubscriber } from '../service/subscribers/product-quantity.subscriber';
import { DepartmentModule } from './department.module';

@Module({
    imports: [TypeOrmModule.forFeature([ProductQuantityRepository]), DepartmentModule],
    controllers: [ProductQuantityController],
    providers: [ProductQuantityService, ProductQuantitySubscriber],
    exports: [ProductQuantityService],
})
export class ProductQuantityModule {}
