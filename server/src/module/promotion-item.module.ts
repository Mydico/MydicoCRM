import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionItemController } from '../web/rest/promotion-item.controller';
import { PromotionItemRepository } from '../repository/promotion-item.repository';
import { PromotionItemService } from '../service/promotion-item.service';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([PromotionItemRepository])],
    controllers: [PromotionItemController],
    providers: [PromotionItemService],
    exports: [PromotionItemService],
})
export class PromotionItemModule {}
