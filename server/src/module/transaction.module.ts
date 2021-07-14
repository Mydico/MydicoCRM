import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from '../web/rest/transaction.controller';
import { TransactionRepository } from '../repository/transaction.repository';
import { TransactionService } from '../service/transaction.service';
import { TransactionSubscriber } from '../service/subscribers/transaction.subscriber';
import { DepartmentModule } from './department.module';

@Module({
  imports: [CacheModule.register(), TypeOrmModule.forFeature([TransactionRepository]), DepartmentModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionSubscriber],
  exports: [TransactionService]
})
export class TransactionModule {}
