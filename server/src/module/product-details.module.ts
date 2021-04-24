import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDetailsController } from '../web/rest/product-details.controller';
import { ProductDetailsRepository } from '../repository/product-details.repository';
import { ProductDetailsService } from '../service/product-details.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([ProductDetailsRepository])],
    controllers: [ProductDetailsController],
    providers: [ProductDetailsService],
    exports: [ProductDetailsService],
})
export class ProductDetailsModule {}
