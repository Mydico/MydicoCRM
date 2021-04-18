import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDetailsController } from '../web/rest/product-details.controller';
import { ProductDetailsRepository } from '../repository/product-details.repository';
import { ProductDetailsService } from '../service/product-details.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductDetailsRepository])],
    controllers: [ProductDetailsController],
    providers: [ProductDetailsService],
    exports: [ProductDetailsService],
})
export class ProductDetailsModule {}
