import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionController } from '../web/rest/promotion.controller';
import { PromotionRepository } from '../repository/promotion.repository';
import { PromotionService } from '../service/promotion.service';

@Module({
  imports: [TypeOrmModule.forFeature([PromotionRepository])],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService]
})
export class PromotionModule {}
