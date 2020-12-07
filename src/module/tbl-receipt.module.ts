import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblReceiptController } from '../web/rest/tbl-receipt.controller';
import { TblReceiptRepository } from '../repository/tbl-receipt.repository';
import { TblReceiptService } from '../service/tbl-receipt.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblReceiptRepository])],
  controllers: [TblReceiptController],
  providers: [TblReceiptService],
  exports: [TblReceiptService]
})
export class TblReceiptModule {}
