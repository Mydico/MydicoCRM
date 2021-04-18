import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionProductController } from '../web/rest/promotion-product.controller';
import { PromotionProductRepository } from '../repository/promotion-product.repository';
import { PromotionProductService } from '../service/promotion-product.service';

@Module({
    imports: [TypeOrmModule.forFeature([PromotionProductRepository])],
    controllers: [PromotionProductController],
    providers: [PromotionProductService],
    exports: [PromotionProductService],
})
export class PromotionProductModule {}
