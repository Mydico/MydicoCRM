import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionController } from '../web/rest/promotion.controller';
import { PromotionRepository } from '../repository/promotion.repository';
import { PromotionService } from '../service/promotion.service';
import { PromotionProductModule } from './promotion-product.module';
import { PromotionItemModule } from './promotion-item.module';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([PromotionRepository]), PromotionProductModule, PromotionItemModule],
    controllers: [PromotionController],
    providers: [PromotionService],
    exports: [PromotionService],
})
export class PromotionModule {}
