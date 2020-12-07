import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblTransactionController } from '../web/rest/tbl-transaction.controller';
import { TblTransactionRepository } from '../repository/tbl-transaction.repository';
import { TblTransactionService } from '../service/tbl-transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblTransactionRepository])],
  controllers: [TblTransactionController],
  providers: [TblTransactionService],
  exports: [TblTransactionService]
})
export class TblTransactionModule {}
