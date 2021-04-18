import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBrandController } from '../web/rest/product-brand.controller';
import { ProductBrandRepository } from '../repository/product-brand.repository';
import { ProductBrandService } from '../service/product-brand.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductBrandRepository])],
    controllers: [ProductBrandController],
    providers: [ProductBrandService],
    exports: [ProductBrandService],
})
export class ProductBrandModule {}
