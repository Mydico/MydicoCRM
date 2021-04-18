import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionCustomerLevelController } from '../web/rest/promotion-customer-level.controller';
import { PromotionCustomerLevelRepository } from '../repository/promotion-customer-level.repository';
import { PromotionCustomerLevelService } from '../service/promotion-customer-level.service';

@Module({
    imports: [TypeOrmModule.forFeature([PromotionCustomerLevelRepository])],
    controllers: [PromotionCustomerLevelController],
    providers: [PromotionCustomerLevelService],
    exports: [PromotionCustomerLevelService],
})
export class PromotionCustomerLevelModule {}
