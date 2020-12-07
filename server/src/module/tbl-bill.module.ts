import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblBillController } from '../web/rest/tbl-bill.controller';
import { TblBillRepository } from '../repository/tbl-bill.repository';
import { TblBillService } from '../service/tbl-bill.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblBillRepository])],
  controllers: [TblBillController],
  providers: [TblBillService],
  exports: [TblBillService]
})
export class TblBillModule {}
