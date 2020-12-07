import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblPromotionCustomerLevelController } from '../web/rest/tbl-promotion-customer-level.controller';
import { TblPromotionCustomerLevelRepository } from '../repository/tbl-promotion-customer-level.repository';
import { TblPromotionCustomerLevelService } from '../service/tbl-promotion-customer-level.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblPromotionCustomerLevelRepository])],
  controllers: [TblPromotionCustomerLevelController],
  providers: [TblPromotionCustomerLevelService],
  exports: [TblPromotionCustomerLevelService]
})
export class TblPromotionCustomerLevelModule {}
