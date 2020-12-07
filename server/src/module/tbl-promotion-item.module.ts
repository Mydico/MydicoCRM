import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblPromotionItemController } from '../web/rest/tbl-promotion-item.controller';
import { TblPromotionItemRepository } from '../repository/tbl-promotion-item.repository';
import { TblPromotionItemService } from '../service/tbl-promotion-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblPromotionItemRepository])],
  controllers: [TblPromotionItemController],
  providers: [TblPromotionItemService],
  exports: [TblPromotionItemService]
})
export class TblPromotionItemModule {}
