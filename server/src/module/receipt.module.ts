import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptController } from '../web/rest/receipt.controller';
import { ReceiptRepository } from '../repository/receipt.repository';
import { ReceiptService } from '../service/receipt.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReceiptRepository])],
  controllers: [ReceiptController],
  providers: [ReceiptService],
  exports: [ReceiptService]
})
export class ReceiptModule {}
